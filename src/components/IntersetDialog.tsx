"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import TipTapEditor from "./TipTapEditor";
import { EntryDialog, Field, triggerFor, useEntryForm } from "./editor/EntryDialog";
import { useI18n } from "@/i18n/I18nProvider";
import { Gamepad2 } from "lucide-react";

type Props = {
  children: ReactNode;
  label?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: number;
};

/** Add / edit an interest. */
export default function IntersetDialog({ children, label, open, setOpen, id }: Props) {
  const { t } = useI18n();
  const copy = t.editor.forms.interest;
  const { item, setItem, save, isEdit } = useEntryForm<IntersetType>("Intersets", id, open, () => ({ label: "", value: "" }));

  return (
    <EntryDialog
      open={open}
      setOpen={setOpen}
      trigger={triggerFor(children, label)}
      title={isEdit ? copy.edit : copy.add}
      description={copy.desc}
      canSave={item.label.trim().length > 0}
      onSave={save}
      icon={Gamepad2}
    >
      <Field label={copy.name}>
        {(fid) => (
          <Input id={fid} required autoFocus value={item.label} onChange={(e) => setItem((p) => ({ ...p, label: e.target.value }))} className="h-11" />
        )}
      </Field>
      <Field label={copy.details} optional>
        {(fid) => (
          <TipTapEditor labelledBy={`${fid}-label`} value={item.value ?? ""} onChange={(e) => setItem((p) => ({ ...p, value: e.target.value }))} />
        )}
      </Field>
    </EntryDialog>
  );
}

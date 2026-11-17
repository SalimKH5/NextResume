"use client";

import { useEffect, useId, useState, type Dispatch, type ElementType, type ReactElement, type ReactNode, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDragDrop } from "../DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import type { ListField } from "./useSortableList";

type WithId = { id: number };

/** Highest id + 1: unique even after deletions (length + 1 was not). */
export const nextId = (list?: WithId[]) => (list ?? []).reduce((max, x) => Math.max(max, Number(x.id) || 0), 0) + 1;

/**
 * Add / edit state for one entry of a resume list. The form is reloaded every
 * time it opens, so "add" always starts blank and "edit" shows current values.
 */
export function useEntryForm<T extends WithId>(field: ListField, id: number | undefined, open: boolean, blank: () => Omit<T, "id">) {
  const { information, setInformations } = useDragDrop();
  const isEdit = id !== undefined; // id 0 is a valid id
  const load = (): T => {
    const list = (information[field] as T[] | undefined) ?? [];
    const existing = isEdit ? list.find((x) => x.id === id) : undefined;
    return existing ? { ...existing } : ({ ...blank(), id: nextId(list) } as T);
  };
  const [item, setItem] = useState<T>(load);

  useEffect(() => {
    if (open) setItem(load());
    // reload only when the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const save = () =>
    setInformations((prev) => {
      const list = (prev[field] as T[] | undefined) ?? [];
      return { ...prev, [field]: isEdit ? list.map((x) => (x.id === id ? item : x)) : [item, ...list] };
    });

  return { item, setItem, save, isEdit };
}

/** The button that opens a form: either the caller's element, or an icon wrapped in a labelled button. */
export function triggerFor(children: ReactNode, label?: string): ReactElement {
  return label ? (
    <button type="button" className="nr-action" aria-label={label}>
      {children}
    </button>
  ) : (
    (children as ReactElement)
  );
}

export function EntryDialog({
  open,
  setOpen,
  trigger,
  title,
  description,
  icon: Icon,
  canSave,
  onSave,
  children,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  trigger: ReactElement;
  title: string;
  description: string;
  icon?: ElementType;
  canSave: boolean;
  onSave: () => void;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[600px]">
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSave) return;
            onSave();
            setOpen(false);
          }}
        >
          {/* header */}
          <DialogHeader className="flex-row items-start gap-4 border-b border-line px-6 pb-5 pt-6 text-left">
            {Icon && (
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-lg bg-mint-wash text-ink">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
            )}
            <div className="flex flex-col gap-1 pr-6">
              <DialogTitle className="text-xl font-medium tracking-tight">{title}</DialogTitle>
              <DialogDescription className="leading-snug">{description}</DialogDescription>
            </div>
          </DialogHeader>

          {/* fields: the only part that scrolls */}
          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">{children}</div>

          {/* actions stay visible */}
          <DialogFooter className="border-t border-line bg-muted/50 px-6 py-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10">
                {t.editor.forms.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!canSave} className="h-10 min-w-28">
              {t.editor.forms.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Label + control, linked by id. `optional` adds a visible hint instead of marking required fields. */
export function Field({
  label,
  optional,
  className,
  children,
}: {
  label: string;
  optional?: boolean;
  className?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  const { t } = useI18n();
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label htmlFor={id} id={`${id}-label`} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> {t.profile.optional}</span>}
      </label>
      {children(id)}
    </div>
  );
}

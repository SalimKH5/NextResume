"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useDragDrop } from "../DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import type { ListField } from "./useSortableList";

/** Keyboard alternative to dragging list items (WCAG 2.1.1): move one step up or down. */
export function ItemMoveButtons({ field, id }: { field: ListField; id: number }) {
  const { information, setInformations } = useDragDrop();
  const { t } = useI18n();
  const list = (information[field] as { id: number }[] | undefined) ?? [];
  const index = list.findIndex((x) => x.id === id);
  if (list.length < 2 || index < 0) return null;

  const move = (delta: number) =>
    setInformations((prev) => {
      const items = [...((prev[field] as { id: number }[] | undefined) ?? [])];
      const from = items.findIndex((x) => x.id === id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= items.length) return prev;
      [items[from], items[to]] = [items[to], items[from]];
      return { ...prev, [field]: items };
    });

  return (
    <>
      <button type="button" className="nr-action" aria-label={t.editor.item.up} title={t.editor.item.up} disabled={index === 0} onClick={() => move(-1)}>
        <ArrowUp />
      </button>
      <button
        type="button"
        className="nr-action"
        aria-label={t.editor.item.down}
        title={t.editor.item.down}
        disabled={index === list.length - 1}
        onClick={() => move(1)}
      >
        <ArrowDown />
      </button>
    </>
  );
}

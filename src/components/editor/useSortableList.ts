"use client";

import { useEffect, type RefObject } from "react";
import Sortable from "sortablejs";
import { useDragDrop } from "../DraggableContext";

export type ListField = "skills" | "Languages" | "Expriences" | "Educations" | "Intersets";

/**
 * Drag to reorder the items of a list inside a section.
 * SortableJS moves DOM nodes itself; we put the node back and reorder the
 * array in state instead, so React stays in charge of the DOM and the new
 * order is saved (before, the order was only visual and React got out of sync).
 */
export function useSortableList(ref: RefObject<HTMLElement | null>, field: ListField) {
  const { setInformations } = useDragDrop();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sortable = Sortable.create(el, {
      animation: 180,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      ghostClass: "nr-sort-ghost",
      chosenClass: "nr-sort-chosen",
      filter: ".nr-actions, input, textarea, button",
      preventOnFilter: false,
      onEnd: ({ item, from, oldIndex, newIndex }) => {
        if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;
        // undo Sortable's DOM move; React re-renders in the new order
        from.removeChild(item);
        from.insertBefore(item, from.children[oldIndex] ?? null);
        setInformations((prev) => {
          const list = [...((prev[field] as unknown[] | undefined) ?? [])];
          const [moved] = list.splice(oldIndex, 1);
          list.splice(newIndex, 0, moved);
          return { ...prev, [field]: list };
        });
      },
    });
    return () => sortable.destroy();
  }, [ref, field, setInformations]);
}

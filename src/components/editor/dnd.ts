"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useDragDrop } from "../DraggableContext";
import { sectionItem, sectionKindOf, type SectionKind } from "../pages/sections";

/* ---------- what is being dragged (dataTransfer can't be read during dragover) ---------- */

export type DragPayload =
  | { source: "sidebar"; kind: SectionKind }
  | { source: "page"; kind: SectionKind; zone: string; page: number; index: number };

let current: DragPayload | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const dragStore = {
  start(p: DragPayload) {
    current = p;
    emit();
  },
  end() {
    if (!current) return;
    current = null;
    emit();
  },
  get: () => current,
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useDragPayload() {
  return useSyncExternalStore(subscribe, dragStore.get, () => null);
}

/* ---------- section operations ---------- */

export type Slot = { zone: string; page: number; index: number };

/** Remove every item of `kind`; returns the new map and the removed item (to keep its element). */
function takeKind(map: DroppedItemsMap, kind: SectionKind) {
  let taken: DroppedItem | null = null;
  const next: DroppedItemsMap = {};
  Object.entries(map).forEach(([zone, pages]) => {
    next[zone] = {};
    Object.entries(pages ?? {}).forEach(([page, items]) => {
      next[zone][Number(page)] = (items ?? []).filter((it) => {
        if (sectionKindOf(it.id) === kind) {
          taken ??= it;
          return false;
        }
        return true;
      });
    });
  });
  return { next, taken: taken as DroppedItem | null };
}

function insertAt(map: DroppedItemsMap, item: DroppedItem, { zone, page, index }: Slot): DroppedItemsMap {
  const zonePages = { ...(map[zone] ?? {}) };
  const list = [...(zonePages[page] ?? [])];
  list.splice(Math.max(0, Math.min(index, list.length)), 0, item);
  zonePages[page] = list;
  return { ...map, [zone]: zonePages };
}

export function useSectionOps() {
  const { droppedItems, setDroppedItems } = useDragDrop();

  /** Put `kind` at `to`, removing it from wherever it was (a section appears once). */
  const place = useCallback(
    (kind: SectionKind, to: Slot, from?: Slot) => {
      setDroppedItems((prev) => {
        let target = to;
        // Moving down inside the same list: removing the item first shifts the slot by one.
        if (from && from.zone === to.zone && from.page === to.page && from.index < to.index) {
          target = { ...to, index: to.index - 1 };
        }
        const { next, taken } = takeKind(prev, kind);
        return insertAt(next, taken ?? sectionItem(kind), target);
      });
    },
    [setDroppedItems]
  );

  const remove = useCallback(
    (kind: SectionKind) => setDroppedItems((prev) => takeKind(prev, kind).next),
    [setDroppedItems]
  );

  /** Add at the end of the main column on the last page. */
  const append = useCallback(
    (kind: SectionKind) => {
      setDroppedItems((prev) => {
        const zone = prev["zone-B"] ? "zone-B" : Object.keys(prev)[0] ?? "zone-B";
        const pages = Object.keys(prev[zone] ?? { 1: [] }).map(Number);
        const page = pages.length ? Math.max(...pages) : 1;
        const { next, taken } = takeKind(prev, kind);
        return insertAt(next, taken ?? sectionItem(kind), { zone, page, index: Infinity });
      });
    },
    [setDroppedItems]
  );

  const zones = Object.keys(droppedItems);
  const otherZone = (zone: string) => zones.find((z) => z !== zone) ?? null;

  return { place, remove, append, otherZone };
}

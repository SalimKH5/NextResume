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

/* ---------- autoscroll while dragging ----------
   Native drag and drop does not scroll the page, so reaching a zone lower on
   the CV meant dropping, scrolling and dragging again. Holding the pointer near
   the top or bottom edge now scrolls, faster the closer it gets. */
const TOP_EDGE = 150; // sticky header + editor bar take ~120px
const BOTTOM_EDGE = 110;
const MAX_SPEED = 28; // px per frame
let pointerY = -1;
let frame = 0;

const trackPointer = (e: DragEvent) => {
  pointerY = e.clientY;
};

function autoscroll() {
  if (!current) return;
  if (pointerY >= 0) {
    const h = window.innerHeight;
    let speed = 0;
    if (pointerY < TOP_EDGE) speed = -MAX_SPEED * ((TOP_EDGE - pointerY) / TOP_EDGE);
    else if (pointerY > h - BOTTOM_EDGE) speed = MAX_SPEED * ((pointerY - (h - BOTTOM_EDGE)) / BOTTOM_EDGE);
    if (speed) window.scrollBy(0, Math.round(speed));
  }
  frame = requestAnimationFrame(autoscroll);
}

// Safety net: if the dragged element re-renders mid-drag, its own dragend can
// be lost; ending on any page-level dragend/drop keeps autoscroll and the drop
// highlighting from running forever. Deferred so a zone's onDrop reads the
// payload first.
const endSoon = () => setTimeout(() => dragStore.end(), 0);

export const dragStore = {
  start(p: DragPayload) {
    current = p;
    pointerY = -1;
    document.addEventListener("dragover", trackPointer, true);
    document.addEventListener("dragend", endSoon, true);
    document.addEventListener("drop", endSoon, true);
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(autoscroll);
    emit();
  },
  end() {
    if (!current) return;
    current = null;
    document.removeEventListener("dragover", trackPointer, true);
    document.removeEventListener("dragend", endSoon, true);
    document.removeEventListener("drop", endSoon, true);
    cancelAnimationFrame(frame);
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

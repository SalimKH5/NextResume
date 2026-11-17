"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowLeftRight, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { useDragDrop } from "./DraggableContext";
import { dragStore, useDragPayload, useSectionOps } from "./editor/dnd";
import { IconButton } from "./editor/Tip";
import { sectionKindOf } from "./pages/sections";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

type DropZoneProps = { zoneId: string; page?: number };

const NOT_A_HANDLE = "input, textarea, select, button, a, li, label, [contenteditable=true], .nr-actions, .fixed, [role=toolbar]";

export default function DropZone({ zoneId, page = 1 }: DropZoneProps) {
  const { droppedItems, fontOptions } = useDragDrop();
  const { place, remove, otherZone } = useSectionOps();
  const payload = useDragPayload();
  const { t } = useI18n();
  const items = droppedItems[zoneId]?.[page] ?? [];
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [insertAt, setInsertAt] = useState<number | null>(null);

  const dragging = payload !== null;
  const other = otherZone(zoneId);

  /** Insertion index from the pointer: before the first item whose middle is below it. */
  const indexFromPointer = (clientY: number) => {
    for (let i = 0; i < items.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (clientY < r.top + r.height / 2) return i;
    }
    return items.length;
  };

  const onDragOver = (e: React.DragEvent) => {
    if (!dragStore.get()) return; // not a section drag (e.g. a list item inside a section)
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const idx = indexFromPointer(e.clientY);
    if (idx !== insertAt) setInsertAt(idx);
  };

  const onDrop = (e: React.DragEvent) => {
    const p = dragStore.get();
    if (!p) return;
    e.preventDefault();
    const index = insertAt ?? items.length;
    const to = { zone: zoneId, page, index };
    if (p.source === "sidebar") place(p.kind, to);
    else place(p.kind, to, { zone: p.zone, page: p.page, index: p.index });
    setInsertAt(null);
    dragStore.end();
  };

  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setInsertAt(null);
  };

  const indicator = (i: number) =>
    insertAt === i && (
      <div aria-hidden="true" className="no-print pointer-events-none relative h-0">
        <div className="absolute inset-x-0 -top-[3px] h-[3px] animate-in fade-in rounded-full bg-mint shadow-[0_0_0_3px_rgba(23,226,165,0.25)] duration-150" />
      </div>
    );

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      style={{ gap: fontOptions.SpaceContent }}
      className={cn(
        "relative flex flex-col rounded-sm transition-[background-color,outline-color]",
        dragging ? "min-h-16 outline-2 outline-dashed outline-offset-4 outline-mint/50" : "min-h-6",
        insertAt !== null && "bg-mint/5 outline-mint"
      )}
    >
      {items.map((item, index) => {
        const kind = sectionKindOf(item.id);
        const isSource =
          payload?.source === "page" && payload.zone === zoneId && payload.page === page && payload.index === index;
        return (
          <div key={item.id} className="contents">
            {indicator(index)}
            <div
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              data-section={kind ?? undefined}
              // The whole section can be grabbed, except where the pointer lands on something
              // interactive or on a list item (list items reorder inside the section).
              onPointerDown={(e) => {
                const target = e.target as HTMLElement;
                e.currentTarget.draggable = !!kind && !target.closest(NOT_A_HANDLE);
              }}
              onDragStart={(e) => {
                if (e.target !== e.currentTarget || !kind) return; // a list item or the handle started it
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", kind);
                dragStore.start({ source: "page", kind, zone: zoneId, page, index });
              }}
              onDragEnd={() => dragStore.end()}
              className={cn(
                "nr-section group/section relative cursor-grab rounded-sm transition-[box-shadow,opacity,transform] duration-200 ease-out",
                "hover:shadow-[0_0_0_1px_var(--mint),0_0_0_6px_rgba(23,226,165,0.12)] focus-within:shadow-[0_0_0_1px_var(--mint),0_0_0_6px_rgba(23,226,165,0.12)]",
                isSource && "scale-[0.99] opacity-40"
              )}
            >
              {item.component}

              {kind && (
                <div
                  role="toolbar"
                  aria-label={t.sections[kind]}
                  className="no-print absolute -top-4 right-0 z-20 flex items-center gap-0.5 rounded-md border border-line bg-white p-0.5 text-ink translate-y-1 opacity-0 shadow-md transition-[opacity,transform] duration-150 ease-out group-hover/section:translate-y-0 group-hover/section:opacity-100 focus-within:translate-y-0 focus-within:opacity-100"
                  style={{ fontSize: 14, fontFamily: "'DM Sans Variable', system-ui, sans-serif" }}
                >
                  <IconButton
                    label={t.editor.section.drag}
                    draggable
                    className="cursor-grab active:cursor-grabbing"
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", kind); // required by Firefox
                      const frame = itemRefs.current[index];
                      if (frame) e.dataTransfer.setDragImage(frame, 24, 16);
                      dragStore.start({ source: "page", kind, zone: zoneId, page, index });
                    }}
                    onDragEnd={() => dragStore.end()}
                  >
                    <GripVertical className="size-4" />
                  </IconButton>
                  <IconButton
                    label={t.editor.section.up}
                    disabled={index === 0}
                    onClick={() => place(kind, { zone: zoneId, page, index: index - 1 }, { zone: zoneId, page, index })}
                  >
                    <ArrowUp className="size-4" />
                  </IconButton>
                  <IconButton
                    label={t.editor.section.down}
                    disabled={index === items.length - 1}
                    onClick={() => place(kind, { zone: zoneId, page, index: index + 2 }, { zone: zoneId, page, index })}
                  >
                    <ArrowDown className="size-4" />
                  </IconButton>
                  {other && (
                    <IconButton
                      label={t.editor.section.otherColumn}
                      onClick={() => place(kind, { zone: other, page, index: Infinity })}
                    >
                      <ArrowLeftRight className="size-4" />
                    </IconButton>
                  )}
                  <IconButton
                    label={t.editor.section.remove}
                    onClick={() => remove(kind)}
                    className="hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {indicator(items.length)}

      {dragging && items.length === 0 && (
        <p className="no-print pointer-events-none flex flex-1 items-center justify-center py-3 text-center text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans Variable', system-ui, sans-serif" }}>
          {t.editor.dropHere}
        </p>
      )}
    </div>
  );
}

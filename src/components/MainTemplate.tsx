"use client";

import { useEffect, useRef, useState } from "react";
import { useDragDrop } from "@/components/DraggableContext";
import SidebarApp from "@/components/SidebarApp";
import { AccordionDemo } from "./ui/AccordioDemo";
import { Button } from "./ui/button";
import {
  deserializeZones,
  serializeZones,
  templateByKey,
  type SavedLayout,
} from "./pages/templates";

type SaveState = "idle" | "saving" | "saved" | "error";

const SAVE_DELAY_MS = 800;

const SAVE_LABEL: Record<SaveState, string> = {
  idle: "All changes saved",
  saving: "Saving…",
  saved: "All changes saved",
  error: "Not saved. Check your connection.",
};

const MainTemplate = ({ info }: { info: GetTypeInformation }) => {
  const {
    SelectedTemplate,
    setSelectedTemplate,
    containerRef,
    information,
    setInformations,
    fontOptions,
    setFontOptions,
    droppedItems,
    setDroppedItems,
    templateKey,
    setTemplateKey,
  } = useDragDrop();
  const [preview, setPreview] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // The drag-and-drop context lives at the root, so on mount it can still hold
  // the previous resume (or the defaults). Saving only starts once this
  // resume's own data is in the context, otherwise stale data would be saved.
  const loaded = useRef<{ id: string; data: InformationsType; armed: boolean } | null>(null);

  useEffect(() => {
    if (!info.informations) return;
    const saved = info.layout as SavedLayout | undefined;
    const tpl = templateByKey(saved?.template);
    loaded.current = { id: info._id, data: info.informations, armed: false };
    setInformations(info.informations);
    setTemplateKey(tpl.key);
    setSelectedTemplate(() => tpl.template);
    setFontOptions({ ...tpl.style, ...(saved?.style ?? {}) });
    setDroppedItems(deserializeZones(saved?.zones ?? tpl.zones));
    // Load once per resume: re-running on new prop objects would reset the user's edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info._id]);

  useEffect(() => {
    const l = loaded.current;
    if (!l || l.id !== info._id) return;
    if (!l.armed) {
      // First render that holds exactly what we loaded: start saving after this one.
      if (information === l.data) l.armed = true;
      return;
    }
    setSaveState("saving");
    const controller = new AbortController();
    const t = setTimeout(async () => {
      const layout: SavedLayout = {
        template: templateKey,
        style: fontOptions,
        zones: serializeZones(droppedItems),
      };
      try {
        const res = await fetch("/api/CvtTmplates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            id_template: info._id,
            informations: information,
            title_template: info.title_template,
            layout,
          }),
        });
        setSaveState(res.ok ? "saved" : "error");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSaveState("error");
      }
    }, SAVE_DELAY_MS);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [information, droppedItems, fontOptions, templateKey, info._id, info.title_template]);

  return (
    <div className="relative flex w-full">
      <SidebarApp />

      <div className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(rgba(6,25,27,0.09)_1px,transparent_1px)] [background-size:18px_18px]">
        <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-8">
          <h1 className="truncate text-sm font-medium" title={info.title_template}>
            {info.title_template || "Untitled resume"}
          </h1>
          <p
            aria-live="polite"
            className={`shrink-0 text-xs ${saveState === "error" ? "text-destructive" : "text-muted-foreground"}`}
          >
            {saveState !== "saving" && saveState !== "error" && (
              <span aria-hidden="true" className="mr-1.5 inline-block size-1.5 rounded-full bg-mint align-middle" />
            )}
            {SAVE_LABEL[saveState]}
          </p>
        </div>

        {preview && (
          <div className="flex w-full justify-center py-4 lg:hidden">
            {containerRef && <SelectedTemplate containerRef={containerRef} />}
          </div>
        )}
        <div className="hidden w-full overflow-x-auto px-8 pb-24 pt-6 lg:flex lg:justify-center">
          {containerRef && <SelectedTemplate containerRef={containerRef} />}
        </div>

        {!preview && (
          <div className="flex w-full items-center justify-between px-3 pb-24 pt-3 lg:hidden">
            <AccordionDemo />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 z-40 flex w-full items-center justify-end border-t border-line bg-background px-4 py-3 lg:hidden">
        <Button onClick={() => setPreview((p) => !p)}>{preview ? "Edit details" : "Preview"}</Button>
      </div>
    </div>
  );
};

export default MainTemplate;

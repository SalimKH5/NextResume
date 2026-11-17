"use client";

import { useEffect, useRef, useState } from "react";
import { useDragDrop } from "@/components/DraggableContext";
import SidebarApp from "@/components/SidebarApp";
import { AccordionDemo } from "./ui/AccordioDemo";
import { Button } from "./ui/button";

type SaveState = "idle" | "saving" | "saved" | "error";

const SAVE_DELAY_MS = 800;

const MainTemplate = ({ info }: { info: GetTypeInformation }) => {
  const { SelectedTemplate, containerRef, information, setInformations } = useDragDrop();
  const [preview, setPreview] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // The drag-and-drop context lives at the root, so it can still hold the
  // previous resume (or the defaults) when this page mounts. Saving is only
  // enabled once this resume's data has been loaded into the context; before
  // this fix the first render PUT stale data over the stored resume.
  const loaded = useRef<{ id: string; data: InformationsType; armed: boolean } | null>(null);

  useEffect(() => {
    if (!info.informations) return;
    loaded.current = { id: info._id, data: info.informations, armed: false };
    setInformations(info.informations);
  }, [info._id, info.informations, setInformations]);

  useEffect(() => {
    const l = loaded.current;
    if (!l || l.id !== info._id) return;
    // First time the context holds exactly what we loaded: start saving after this.
    if (information === l.data) {
      l.armed = true;
      return;
    }
    if (!l.armed) return; // still the stale context from before the load
    setSaveState("saving");
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/CvtTmplates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            id_template: info._id,
            informations: information,
            title_template: information?.title || info.title_template,
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
  }, [information, info._id, info.title_template]);

  const saveLabel: Record<SaveState, string> = {
    idle: "All changes saved",
    saving: "Saving…",
    saved: "All changes saved",
    error: "Not saved. Check your connection.",
  };

  return (
    <div className="relative flex h-auto w-full py-5 md:h-full">
      <SidebarApp />
      <div className="flex h-full w-full flex-col lg:pl-16">
        <p
          aria-live="polite"
          className={`px-4 pb-2 text-right text-xs sm:px-8 ${
            saveState === "error" ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {saveState === "saving" ? null : (
            <span aria-hidden="true" className="mr-1.5 inline-block size-1.5 rounded-full bg-mint align-middle" />
          )}
          {saveLabel[saveState]}
        </p>

        {preview && (
          <div className="flex w-full justify-center py-3 lg:hidden">
            {containerRef && <SelectedTemplate containerRef={containerRef} />}
          </div>
        )}
        <div className="hidden w-full py-3 lg:flex md:justify-center">
          {containerRef && <SelectedTemplate containerRef={containerRef} />}
        </div>

        {!preview && (
          <div className="flex w-full items-center justify-between px-3 pb-20 lg:hidden">
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

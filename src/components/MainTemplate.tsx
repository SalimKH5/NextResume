"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minus, Plus, Redo2, Undo2 } from "lucide-react";
import { useDragDrop } from "@/components/DraggableContext";
import SidebarApp from "@/components/SidebarApp";
import { AccordionDemo } from "./ui/AccordioDemo";
import { Button } from "./ui/button";
import { IconButton } from "./editor/Tip";
import { useEditorHistory } from "./editor/useHistory";
import {
  deserializeZones,
  serializeZones,
  templateByKey,
  type SavedLayout,
} from "./pages/templates";
import { useI18n } from "@/i18n/I18nProvider";

type SaveState = "idle" | "saving" | "saved" | "error";

const SAVE_DELAY_MS = 800;
const PAGE_WIDTH = 790;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

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
  const { t } = useI18n();
  const [preview, setPreview] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // The drag-and-drop context lives at the root, so on mount it can still hold
  // the previous resume (or the defaults). Saving and history only start once
  // this resume's own data is in the context, otherwise stale data would be saved.
  const loaded = useRef<{ id: string; data: InformationsType; armed: boolean } | null>(null);

  useEffect(() => {
    setReady(false);
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
      if (information === l.data) {
        l.armed = true;
        setReady(true);
      }
      return;
    }
    setSaveState("saving");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
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
      clearTimeout(timer);
      controller.abort();
    };
  }, [information, droppedItems, fontOptions, templateKey, info._id, info.title_template]);

  const { undo, redo, canUndo, canRedo } = useEditorHistory(info._id, ready);

  /* ---------- zoom ---------- */
  const fitZoom = useCallback(() => {
    const w = canvasRef.current?.clientWidth ?? PAGE_WIDTH;
    return Math.max(ZOOM_MIN, Math.min(1.2, Math.floor(((w - 64) / PAGE_WIDTH) * 20) / 20));
  }, []);

  // Start zoomed out if the page does not fit next to the panels.
  useEffect(() => {
    setZoom(Math.min(1, fitZoom()));
  }, [fitZoom]);

  const clampZoom = (z: number) => Math.round(Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z)) * 100) / 100;
  const mod = isMac() ? "⌘" : "Ctrl+";

  return (
    <div className="relative flex w-full">
      <SidebarApp />

      <div ref={canvasRef} className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(rgba(6,25,27,0.09)_1px,transparent_1px)] [background-size:18px_18px]">
        {/* editor bar */}
        <div className="no-print sticky top-16 z-20 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-background/90 px-4 py-2 backdrop-blur-sm sm:px-6">
          <div role="toolbar" aria-label="History" className="flex items-center gap-0.5">
            <IconButton label={t.editor.undo} shortcut={`${mod}Z`} onClick={undo} disabled={!canUndo}>
              <Undo2 className="size-4" />
            </IconButton>
            <IconButton label={t.editor.redo} shortcut={`${mod}Shift+Z`} onClick={redo} disabled={!canRedo}>
              <Redo2 className="size-4" />
            </IconButton>
          </div>

          <span aria-hidden="true" className="hidden h-5 w-px bg-line lg:block" />

          <div role="toolbar" aria-label="Zoom" className="hidden items-center gap-0.5 lg:flex">
            <IconButton label={t.editor.zoomOut} onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))} disabled={zoom <= ZOOM_MIN}>
              <Minus className="size-4" />
            </IconButton>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="w-14 rounded-md py-1 text-center text-sm tabular-nums hover:bg-mint-wash"
              aria-label={`${Math.round(zoom * 100)}%. Reset to 100%`}
            >
              {Math.round(zoom * 100)}%
            </button>
            <IconButton label={t.editor.zoomIn} onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))} disabled={zoom >= ZOOM_MAX}>
              <Plus className="size-4" />
            </IconButton>
            <IconButton label={t.editor.fit} onClick={() => setZoom(fitZoom())}>
              <Maximize className="size-4" />
            </IconButton>
          </div>

          <h1 className="ml-auto min-w-0 max-w-[40ch] truncate text-sm font-medium" title={info.title_template}>
            {info.title_template || t.editor.untitled}
          </h1>
          <p
            aria-live="polite"
            className={`shrink-0 text-xs ${saveState === "error" ? "text-destructive" : "text-muted-foreground"}`}
          >
            {saveState !== "saving" && saveState !== "error" && (
              <span aria-hidden="true" className="mr-1.5 inline-block size-1.5 rounded-full bg-mint align-middle" />
            )}
            {t.editor.save[saveState]}
          </p>
        </div>

        {preview && (
          <div className="flex w-full justify-center py-4 lg:hidden">
            {containerRef && <SelectedTemplate containerRef={containerRef} />}
          </div>
        )}
        <div className="hidden w-full overflow-auto px-8 pb-24 pt-10 lg:flex lg:justify-center">
          <div style={{ zoom }}>
            {containerRef && <SelectedTemplate containerRef={containerRef} />}
          </div>
        </div>

        {!preview && (
          <div className="flex w-full items-center justify-between px-3 pb-24 pt-3 lg:hidden">
            <AccordionDemo />
          </div>
        )}
      </div>

      <div className="no-print fixed bottom-0 z-40 flex w-full items-center justify-end border-t border-line bg-background px-4 py-3 lg:hidden">
        <Button onClick={() => setPreview((p) => !p)}>{preview ? t.editor.editDetails : t.editor.preview}</Button>
      </div>
    </div>
  );
};

export default MainTemplate;

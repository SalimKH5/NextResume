"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { useDragDrop } from "../DraggableContext";
import { deserializeZones, serializeZones, type ZoneLayout } from "../pages/sections";
import { templateByKey } from "../pages/templates";

type Snapshot = {
  information: InformationsType;
  style: OptionsStyle;
  zones: ZoneLayout;
  template: string;
};

const LIMIT = 100;
const SETTLE_MS = 450; // typing bursts collapse into one undo step

const isTyping = (el: Element | null) =>
  !!el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement || (el as HTMLElement).isContentEditable);

/**
 * Undo / redo for the editor: content, style, section layout and template.
 * `ready` must turn true only once the resume is loaded into the context.
 */
export function useEditorHistory(resumeId: string, ready: boolean) {
  const {
    information, setInformations, fontOptions, setFontOptions,
    droppedItems, setDroppedItems, templateKey, setTemplateKey, setSelectedTemplate,
  } = useDragDrop();

  const past = useRef<Snapshot[]>([]);
  const future = useRef<Snapshot[]>([]);
  const present = useRef<{ snap: Snapshot; key: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, rerender] = useReducer((x: number) => x + 1, 0);

  const snapshot = useCallback(
    (): Snapshot => ({ information, style: fontOptions, zones: serializeZones(droppedItems), template: templateKey }),
    [information, fontOptions, droppedItems, templateKey]
  );

  /** Commit the current state as a new step if it differs from the present one. */
  const commit = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const snap = snapshot();
    const key = JSON.stringify(snap);
    if (!present.current) {
      present.current = { snap, key };
      return;
    }
    if (key === present.current.key) return;
    past.current = [...past.current, present.current.snap].slice(-LIMIT);
    future.current = [];
    present.current = { snap, key };
    rerender();
  }, [snapshot]);

  // Reset when another resume is opened.
  useEffect(() => {
    past.current = [];
    future.current = [];
    present.current = null;
    rerender();
  }, [resumeId]);

  // Record changes once they settle.
  useEffect(() => {
    if (!ready) return;
    if (!present.current) {
      commit();
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(commit, SETTLE_MS);
  }, [ready, information, fontOptions, droppedItems, templateKey, commit]);

  const apply = useCallback(
    (snap: Snapshot) => {
      present.current = { snap, key: JSON.stringify(snap) };
      const tpl = templateByKey(snap.template);
      setInformations(snap.information);
      setFontOptions(snap.style);
      setDroppedItems(deserializeZones(snap.zones));
      setTemplateKey(tpl.key);
      setSelectedTemplate(() => tpl.template);
      rerender();
    },
    [setInformations, setFontOptions, setDroppedItems, setTemplateKey, setSelectedTemplate]
  );

  const undo = useCallback(() => {
    commit(); // don't lose a pending edit
    const prev = past.current.at(-1);
    if (!prev || !present.current) return;
    past.current = past.current.slice(0, -1);
    future.current = [present.current.snap, ...future.current];
    apply(prev);
  }, [commit, apply]);

  const redo = useCallback(() => {
    commit();
    const next = future.current[0];
    if (!next || !present.current) return;
    future.current = future.current.slice(1);
    past.current = [...past.current, present.current.snap];
    apply(next);
  }, [commit, apply]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || isTyping(document.activeElement)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  return {
    undo,
    redo,
    canUndo: past.current.length > 0 || (timer.current !== null && !!present.current),
    canRedo: future.current.length > 0,
  };
}

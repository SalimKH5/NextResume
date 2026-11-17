"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useSession } from "next-auth/react";
import { useDragDrop } from "../DraggableContext";
import DropZone from "../DropZone";
import PersonalInfoDetail from "../PersonalInfoDetail";
import ProfilePhoto from "../ProfilePhoto";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * One configurable A4 layout used by the newer templates.
 * Colour roles (from fontOptions):
 *   BackgroundColor = band / rail fill, primaryColor = text on that fill,
 *   secondColor = accent (section titles, job title).
 */
export type FlexVariant = "studio" | "rail" | "executive" | "banner";

const BODY_TEXT = "#1d2a2b";
const PAGE_HEIGHT = "296.65mm";

/** Pages, overflow detection and "add a page" shared by the flex layouts. */
function usePages() {
  const { droppedItems, maxPages, setMaxPages, setDroppedItems, fontOptions } = useDragDrop();
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [overflow, setOverflow] = useState<Record<number, number>>({});

  const pages = useMemo(() => Array.from({ length: maxPages }, (_, i) => i + 1), [maxPages]);

  useEffect(() => {
    const used = new Set<number>();
    Object.values(droppedItems).forEach((zone) =>
      Object.entries(zone ?? {}).forEach(([p, items]) => {
        if (Array.isArray(items) && items.length) used.add(Number(p));
      })
    );
    setMaxPages(used.size ? Math.max(...used) : 1);
  }, [droppedItems, setMaxPages]);

  useEffect(() => {
    const measure = () => {
      const next: Record<number, number> = {};
      Object.entries(pageRefs.current).forEach(([p, el]) => {
        if (!el) return;
        const extra = el.scrollHeight - el.clientHeight;
        if (extra > 1) next[Number(p)] = extra;
      });
      setOverflow(next);
    };
    const observers = Object.values(pageRefs.current)
      .filter((el): el is HTMLDivElement => !!el)
      .map((el) => {
        const o = new ResizeObserver(measure);
        o.observe(el);
        Array.from(el.children).forEach((c) => o.observe(c));
        return o;
      });
    measure();
    return () => observers.forEach((o) => o.disconnect());
  }, [droppedItems, fontOptions, maxPages]);

  /** Move the last section of each zone on the last page to a new page. */
  const addPage = () => {
    const newPage = maxPages + 1;
    const updated: DroppedItemsMap = {};
    Object.entries(droppedItems).forEach(([zoneId, zonePages]) => {
      const last = [...(zonePages[maxPages] ?? [])];
      const moved = last.splice(-1, 1);
      updated[zoneId] = { ...zonePages, [maxPages]: last, [newPage]: [...(zonePages[newPage] ?? []), ...moved] };
    });
    setDroppedItems(updated);
  };

  const setRef = (p: number) => (el: HTMLDivElement | null) => {
    pageRefs.current[p] = el;
  };

  return { pages, overflow, addPage, setRef };
}

export function OverflowNotice({ onShrink, onAddPage }: { onShrink: () => void; onAddPage: () => void }) {
  const { t } = useI18n();
  return (
    <div role="status" className="no-print flex w-full flex-wrap items-center justify-between gap-3 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <span>{t.editor.overflow}</span>
      <span className="flex gap-2">
        <button type="button" onClick={onShrink} className="rounded-md border border-amber-300 bg-white px-3 py-1.5 font-medium hover:bg-amber-100">
          {t.editor.shrink}
        </button>
        <button type="button" onClick={onAddPage} className="rounded-md bg-ink px-3 py-1.5 font-medium text-white hover:bg-ink/85">
          {t.editor.addPage}
        </button>
      </span>
    </div>
  );
}

function FullName({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { data: session } = useSession();
  const { t } = useI18n();
  const name = [session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(" ");
  return (
    <h2 className={className} style={style}>
      {name || t.resume.yourName}
    </h2>
  );
}

export function makeFlexTemplate(variant: FlexVariant) {
  function FlexTemplate({ containerRef }: { containerRef?: RefObject<HTMLDivElement | null> }) {
    const { fontOptions, information, scale, setFontOptions } = useDragDrop();
    const { pages, overflow, addPage, setRef } = usePages();

    const fill = fontOptions.BackgroundColor ?? "#06191b";
    const onFill = fontOptions.primaryColor ?? "#ffffff";
    const accent = fontOptions.secondColor ?? "#0a9e73";
    const text = fontOptions.textSize ?? 14;
    const padX = (fontOptions.paddingHorizontal ?? 6) * 4 + 16;
    const padY = (fontOptions.paddingVertical ?? 4) * 2 + 16;
    const gap = fontOptions.SpaceContent ?? 18;

    const shrink = () =>
      setFontOptions((prev) => ({
        ...prev,
        textSize: Math.max((Number(prev.textSize) || 14) - 1, 11),
        titleSize: Math.max((prev.titleSize || 18) - 1, 13),
        SpaceContent: Math.max((prev.SpaceContent || 16) - 3, 6),
      }));

    const headline = (
      <>
        <p className="font-semibold" style={{ color: accent, fontSize: text + 2 }}>
          {information.title}
        </p>
        {information.CatchPhrase && (
          <p className="mt-2 max-w-[60ch] leading-relaxed opacity-90" style={{ fontSize: text }}>
            {information.CatchPhrase}
          </p>
        )}
      </>
    );

    const renderPage = (page: number) => {
      const first = page === 1;
      const zoneA = <DropZone zoneId="zone-A" page={page} />;
      const zoneB = <DropZone zoneId="zone-B" page={page} />;

      switch (variant) {
        case "studio":
          return (
            <>
              {first && (
                <header className="flex items-center gap-8" style={{ background: fill, color: onFill, padding: `${padY + 8}px ${padX}px` }}>
                  <div className="min-w-0 flex-1">
                    <FullName className="text-[2.6em] font-semibold leading-none tracking-tight" />
                    <div className="mt-3">{headline}</div>
                    <div className="mt-4 opacity-90">
                      <PersonalInfoDetail />
                    </div>
                  </div>
                  {information?.picture?.display && <ProfilePhoto onDark />}
                </header>
              )}
              <div className="flex flex-1">
                <div className="flex-[1.75] flex flex-col" style={{ padding: `${padY}px ${padX}px`, gap }}>
                  {zoneB}
                </div>
                <div className="flex-1 flex flex-col bg-[#f2f6f5]" style={{ padding: `${padY}px ${padX * 0.7}px`, gap, borderTop: `4px solid ${accent}` }}>
                  {zoneA}
                </div>
              </div>
            </>
          );
        case "rail":
          return (
            <div className="flex flex-1">
              <div className="flex-[1.8] flex flex-col" style={{ padding: `${padY + 8}px ${padX}px`, gap }}>
                {first && (
                  <header className="mb-2">
                    <FullName className="text-[2.4em] font-semibold leading-none tracking-tight" />
                    <div className="mt-3">{headline}</div>
                  </header>
                )}
                {zoneB}
              </div>
              <aside
                className="flex-1 flex flex-col [&_h3]:!text-[var(--on-fill)]"
                style={{ background: fill, color: onFill, padding: `${padY + 8}px ${padX * 0.7}px`, gap, ["--on-fill" as string]: onFill }}
              >
                {first && (
                  <>
                    {information?.picture?.display && (
                      <div className="flex justify-center">
                        <ProfilePhoto onDark />
                      </div>
                    )}
                    <PersonalInfoDetail />
                  </>
                )}
                {zoneA}
              </aside>
            </div>
          );
        case "executive":
          return (
            <div className="flex flex-1 flex-col" style={{ padding: `${padY + 16}px ${padX + 16}px`, gap }}>
              {first && (
                <header className="text-center pb-4" style={{ borderBottom: `1px solid ${accent}` }}>
                  {information?.picture?.display && (
                    <div className="mb-4 flex justify-center">
                      <ProfilePhoto />
                    </div>
                  )}
                  <FullName className="text-[2.5em] font-normal leading-tight tracking-wide" style={{ color: fill }} />
                  <p className="mt-1 uppercase tracking-[0.18em]" style={{ color: accent, fontSize: text - 1 }}>
                    {information.title}
                  </p>
                  <div className="mt-3 flex justify-center [&_ul]:justify-center">
                    <PersonalInfoDetail />
                  </div>
                  {information.CatchPhrase && (
                    <p className="mx-auto mt-4 max-w-[62ch] italic leading-relaxed" style={{ fontSize: text }}>
                      {information.CatchPhrase}
                    </p>
                  )}
                </header>
              )}
              {zoneB}
              {zoneA}
            </div>
          );
        case "banner":
          return (
            <>
              {first && (
                <header className="flex items-center gap-6" style={{ background: fill, color: onFill, padding: `${padY + 4}px ${padX}px` }}>
                  {information?.picture?.display && (
                    <div className="shrink-0">
                      <ProfilePhoto onDark />
                    </div>
                  )}
                  <div className="min-w-0">
                    <FullName className="text-[2.3em] font-bold leading-none" />
                    <p className="mt-2 font-medium opacity-90" style={{ fontSize: text + 2 }}>
                      {information.title}
                    </p>
                  </div>
                </header>
              )}
              {first && (
                <div className="flex flex-col gap-3 border-b" style={{ padding: `${padY}px ${padX}px`, borderColor: `${accent}55` }}>
                  <PersonalInfoDetail />
                  {information.CatchPhrase && <p className="leading-relaxed" style={{ fontSize: text }}>{information.CatchPhrase}</p>}
                </div>
              )}
              <div className="flex flex-1 gap-8" style={{ padding: `${padY}px ${padX}px` }}>
                <div className="flex-[1.5] flex flex-col" style={{ gap }}>{zoneB}</div>
                <div className="flex-1 flex flex-col" style={{ gap }}>{zoneA}</div>
              </div>
            </>
          );
      }
    };

    return (
      <div
        ref={containerRef}
        id="template"
        className={`h-auto w-[790px] ${
          scale === 0.43 ? "origin-top-left scale-[0.395466] mb-[-678.892px] mr-[-480px] transform" : ""
        } md:mb-0 md:mr-0 md:scale-100 md:transform-none`}
      >
        <div className="flex w-full flex-col gap-6">
          {pages.map((page) => (
            <div key={page} className="flex flex-col gap-2">
              <div
                ref={setRef(page)}
                className="flex w-full select-none flex-col bg-white shadow-[0_1px_2px_rgba(6,25,27,0.08),0_12px_40px_-12px_rgba(6,25,27,0.25)] md:w-[790px]"
                style={{ height: PAGE_HEIGHT, fontSize: text, fontFamily: fontOptions.font, color: BODY_TEXT }}
              >
                {renderPage(page)}
              </div>
              {overflow[page] && <OverflowNotice onShrink={shrink} onAddPage={addPage} />}
            </div>
          ))}
        </div>
      </div>
    );
  }
  FlexTemplate.displayName = `FlexTemplate(${variant})`;
  return FlexTemplate;
}

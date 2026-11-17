"use client";

import { useState } from "react";
import {
  Briefcase,
  Gamepad2,
  GraduationCap,
  LanguagesIcon,
  LayoutTemplate,
  Lightbulb,
  Palette,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import PersonalInformation from "./PersonalInformation";
import { useDragDrop } from "./DraggableContext";
import Options from "./Options";
import TemplateSelector from "./pages/TemplateSelector";
import { SECTION_ID, type SectionKind } from "./pages/sections";
import { dragStore, useSectionOps } from "./editor/dnd";
import { IconButton, Tip } from "./editor/Tip";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

type ToolKey = "details" | "templates" | "style" | "sections";

const TOOLS: { key: ToolKey; icon: React.ElementType }[] = [
  { key: "details", icon: UserRound },
  { key: "templates", icon: LayoutTemplate },
  { key: "style", icon: Palette },
  { key: "sections", icon: Plus },
];

const SECTIONS: { kind: SectionKind; icon: React.ElementType }[] = [
  { kind: "experience", icon: Briefcase },
  { kind: "education", icon: GraduationCap },
  { kind: "skills", icon: Lightbulb },
  { kind: "languages", icon: LanguagesIcon },
  { kind: "interests", icon: Gamepad2 },
];

function SectionsPanel() {
  const { isItemDropped } = useDragDrop();
  const { append } = useSectionOps();
  const { t } = useI18n();

  return (
    <ul className="grid grid-cols-2 gap-3">
      {SECTIONS.map(({ kind, icon: Icon }) => {
        const used = isItemDropped(SECTION_ID[kind]);
        return (
          <li key={kind}>
            <button
              type="button"
              draggable
              title={used ? t.editor.dragSection : undefined}
              onClick={() => {
                if (!used) return append(kind);
                // already on the page: bring it into view and flash it
                const el = document.querySelector<HTMLElement>(`[data-section="${kind}"]`);
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                el?.animate(
                  [{ boxShadow: "0 0 0 1px #17e2a5, 0 0 0 10px rgba(23,226,165,0.35)" }, { boxShadow: "0 0 0 0 rgba(23,226,165,0)" }],
                  { duration: 1100, easing: "ease-out" }
                );
              }}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", kind);
                dragStore.start({ source: "sidebar", kind });
              }}
              onDragEnd={() => dragStore.end()}
              className={cn(
                "flex h-24 w-full cursor-grab flex-col items-center justify-center gap-2 rounded-md border text-sm transition-[background-color,border-color,transform] duration-150 active:cursor-grabbing active:scale-[0.98]",
                used
                  ? "border-dashed border-line text-muted-foreground hover:border-mint hover:text-ink"
                  : "border-line bg-background hover:-translate-y-0.5 hover:border-mint hover:bg-mint-wash"
              )}
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {t.sections[kind]}
              {used && <span className="text-[0.7rem]">{t.editor.onPage}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

const PANELS: Record<ToolKey, React.ComponentType> = {
  details: PersonalInformation,
  templates: TemplateSelector,
  style: Options,
  sections: SectionsPanel,
};

export default function AppSidebar() {
  const [activeKey, setActiveKey] = useState<ToolKey | null>("templates");
  const { t } = useI18n();
  const Panel = activeKey ? PANELS[activeKey] : null;
  const copy = activeKey ? t.editor.tools[activeKey] : null;

  return (
    <div className="no-print sticky top-16 z-30 hidden h-[calc(100svh-4rem)] shrink-0 lg:flex">
      <nav aria-label="Editor tools" className="flex w-20 flex-col items-center gap-1 border-r border-line bg-background py-4">
        {TOOLS.map(({ key, icon: Icon }) => {
          const active = activeKey === key;
          return (
            <Tip key={key} label={t.editor.tools[key].title}>
              <button
                type="button"
                onClick={() => setActiveKey(active ? null : key)}
                aria-pressed={active}
                className={cn(
                  "flex w-16 flex-col items-center gap-1 rounded-md py-2.5 text-[0.7rem] font-medium transition-colors",
                  active ? "bg-mint-wash text-ink" : "text-muted-foreground hover:bg-muted hover:text-ink"
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                {t.editor.tools[key].label}
              </button>
            </Tip>
          );
        })}
      </nav>

      {Panel && copy && (
        <section
          aria-label={copy.title}
          className="w-80 overflow-y-auto border-r border-line bg-background px-5 py-5 shadow-[8px_0_24px_-16px_rgba(6,25,27,0.2)]"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-tight">{copy.title}</h2>
            <IconButton label={t.editor.closePanel} onClick={() => setActiveKey(null)} side="left">
              <X className="size-4" />
            </IconButton>
          </div>
          <p className="mb-5 text-sm text-muted-foreground">{copy.hint}</p>
          <Panel />
        </section>
      )}
    </div>
  );
}

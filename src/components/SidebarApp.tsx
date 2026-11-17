"use client";

import { useState } from "react";
import { UserRound, LayoutTemplate, Palette, Plus, X, LanguagesIcon, Briefcase, GraduationCap, Lightbulb, Gamepad2 } from "lucide-react";
import PersonalInformation from "./PersonalInformation";
import { useDragDrop } from "./DraggableContext";
import DraggableItem from "./DraggableItem";
import Languges from "./Languges";
import Expriences from "./Expriences";
import Educations from "./Educations";
import Skills from "./Skills";
import Options from "./Options";
import IntersetComponent from "./IntersetComponent";
import TemplateSelector from "./pages/TemplateSelector";
import { SECTION_ID, type SectionKind } from "./pages/templates";

type SubItemType = {
  label: string;
  items: React.ReactNode;
  kind?: SectionKind; // set for sections that can be dragged onto the page
  icon?: React.ElementType;
};

type SidebarItem = {
  key: string;
  icon: React.ElementType;
  label: string;
  title: string;
  hint?: string;
  subItems: SubItemType[];
  grid?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    key: "details",
    icon: UserRound,
    label: "Details",
    title: "Your details",
    hint: "Shown in the header of the resume.",
    subItems: [{ label: "Personal information", items: <PersonalInformation /> }],
  },
  {
    key: "templates",
    icon: LayoutTemplate,
    label: "Templates",
    title: "Templates",
    subItems: [{ label: "Templates", items: <TemplateSelector /> }],
  },
  {
    key: "style",
    icon: Palette,
    label: "Style",
    title: "Style",
    hint: "Colors, font and spacing for this resume.",
    subItems: [{ label: "Style", items: <Options /> }],
  },
  {
    key: "sections",
    icon: Plus,
    label: "Sections",
    title: "Add a section",
    hint: "Drag a section onto the page. Hover a section on the page to remove it.",
    grid: true,
    subItems: [
      { label: "Languages", kind: "languages", icon: LanguagesIcon, items: <Languges /> },
      { label: "Experience", kind: "experience", icon: Briefcase, items: <Expriences /> },
      { label: "Education", kind: "education", icon: GraduationCap, items: <Educations /> },
      { label: "Skills", kind: "skills", icon: Lightbulb, items: <Skills /> },
      { label: "Interests", kind: "interests", icon: Gamepad2, items: <IntersetComponent /> },
    ],
  },
];

export default function AppSidebar() {
  const [activeKey, setActiveKey] = useState<string | null>("templates");
  const { isItemDropped } = useDragDrop();
  const activeItem = sidebarItems.find((i) => i.key === activeKey) ?? null;

  return (
    <div className="sticky top-16 z-30 hidden h-[calc(100svh-4rem)] shrink-0 lg:flex">
      {/* tool rail */}
      <nav aria-label="Editor tools" className="flex w-20 flex-col items-center gap-1 border-r border-line bg-background py-4">
        {sidebarItems.map((item) => {
          const active = activeKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveKey(active ? null : item.key)}
              aria-pressed={active}
              className={`flex w-16 flex-col items-center gap-1 rounded-md py-2.5 text-[0.7rem] font-medium transition-colors ${
                active ? "bg-mint-wash text-ink" : "text-muted-foreground hover:bg-muted hover:text-ink"
              }`}
            >
              <item.icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* panel */}
      {activeItem && (
        <section
          aria-label={activeItem.title}
          className="w-80 overflow-y-auto border-r border-line bg-background px-5 py-5 shadow-[8px_0_24px_-16px_rgba(6,25,27,0.2)]"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-tight">{activeItem.title}</h2>
            <button
              type="button"
              onClick={() => setActiveKey(null)}
              aria-label="Close panel"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
          {activeItem.hint && <p className="mb-5 text-sm text-muted-foreground">{activeItem.hint}</p>}

          <ul className={activeItem.grid ? "grid grid-cols-2 gap-3" : "flex flex-col gap-6"}>
            {activeItem.subItems.map((sub) => {
              if (!sub.kind) return <li key={sub.label}>{sub.items}</li>;
              const id = SECTION_ID[sub.kind];
              const used = isItemDropped(id);
              const body = (
                <span
                  className={`flex h-24 flex-col items-center justify-center gap-2 rounded-md border text-sm transition-colors ${
                    used
                      ? "border-dashed border-line text-muted-foreground"
                      : "cursor-grab border-line bg-background hover:border-mint hover:bg-mint-wash active:cursor-grabbing"
                  }`}
                >
                  {sub.icon && <sub.icon className="size-5" />}
                  {sub.label}
                  {used && <span className="text-[0.7rem]">On the page</span>}
                </span>
              );
              return (
                <li key={sub.label}>
                  {used ? body : <DraggableItem id={id} component={sub.items}>{body}</DraggableItem>}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

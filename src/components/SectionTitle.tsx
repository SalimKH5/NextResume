"use client";

import { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";

export type TitleField = "titleSkills" | "titleExprience" | "titleEducations" | "titleLanguages" | "titleInterests";

/**
 * Section heading on the resume (h3: the page has h1 = resume name in the editor
 * bar, h2 = person's name). Click or press Enter/Space to rename it.
 */
export default function SectionTitle({ field }: { field: TitleField }) {
  const { information, setInformations, fontOptions } = useDragDrop();
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);
  const refocus = useRef(false);

  // After renaming from the keyboard, put focus back on the title.
  useEffect(() => {
    if (!editing && refocus.current) {
      refocus.current = false;
      titleRef.current?.focus();
    }
  }, [editing]);
  const value = information[field] || t.resume.titles[field];

  const style: React.CSSProperties = {
    color: fontOptions.secondColor,
    fontSize: fontOptions.titleSize,
    borderBottom: "2px solid currentColor",
  };

  if (editing) {
    return (
      <input
        autoFocus
        aria-label={t.editor.sectionTitle}
        value={information[field] ?? value}
        onChange={(e) => setInformations((prev) => ({ ...prev, [field]: e.target.value }))}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") {
            refocus.current = true;
            setEditing(false);
          }
        }}
        onFocus={(e) => e.currentTarget.select()}
        style={style}
        className="no-print w-full bg-mint/5 pb-0.5 font-bold outline-none"
      />
    );
  }

  return (
    <h3 style={style} className="w-full pb-0.5 font-bold">
      <span
        ref={titleRef}
        role="button"
        tabIndex={0}
        title={t.editor.renameSection}
        onClick={() => setEditing(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setEditing(true);
          }
        }}
        className="cursor-text rounded-sm decoration-dotted underline-offset-4 hover:underline"
      >
        {value}
      </span>
    </h3>
  );
}

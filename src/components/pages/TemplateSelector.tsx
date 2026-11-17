"use client";

import { Check } from "lucide-react";
import { useDragDrop } from "../DraggableContext";
import { TEMPLATES, deserializeZones, type TemplateDef } from "./templates";
import { TemplateThumb } from "./TemplateThumb";
import { useI18n } from "@/i18n/I18nProvider";

export default function TemplateSelector() {
  const { templateKey, setTemplateKey, setSelectedTemplate, setFontOptions, setDroppedItems } = useDragDrop();
  const { t } = useI18n();

  const choose = (t: TemplateDef) => {
    setTemplateKey(t.key);
    setSelectedTemplate(() => t.template);
    setFontOptions(() => ({ ...t.style }));
    setDroppedItems(() => deserializeZones(t.zones));
  };

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5">
        {TEMPLATES.map((tpl) => {
          const active = tpl.key === templateKey;
          const copy = t.templates[tpl.key] ?? { label: tpl.label, desc: tpl.description };
          return (
            <li key={tpl.key}>
              <button
                type="button"
                onClick={() => choose(tpl)}
                aria-pressed={active}
                className="group w-full text-left"
              >
                <span
                  className={`relative block overflow-hidden rounded-md border-2 transition-colors ${
                    active ? "border-mint" : "border-line group-hover:border-ink/40"
                  }`}
                >
                  <TemplateThumb thumb={tpl.thumb} />
                  {active && (
                    <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-mint text-ink">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="mt-2 block text-sm font-medium">{copy.label}</span>
                <span className="block text-xs leading-snug text-muted-foreground">{copy.desc}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

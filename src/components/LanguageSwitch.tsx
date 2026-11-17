"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { DICTIONARIES, KNOWN_TITLE_DEFAULTS, LOCALES, type Locale } from "@/i18n/dictionaries";
import { useDragDrop } from "./DraggableContext";
import { cn } from "@/lib/utils";

/**
 * EN / FR switch. Also translates the resume's section titles, but only the
 * ones still at a default value: titles the user typed are left alone.
 */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const { setInformations } = useDragDrop();

  const change = (next: Locale) => {
    if (next === locale) return;
    const titles = DICTIONARIES[next].resume.titles;
    setInformations((prev) => {
      const updated = { ...prev };
      let changed = false;
      (Object.keys(titles) as (keyof typeof titles)[]).forEach((key) => {
        const current = prev[key];
        if (!current || KNOWN_TITLE_DEFAULTS[key].includes(current)) {
          if (current !== titles[key]) {
            updated[key] = titles[key];
            changed = true;
          }
        }
      });
      return changed ? updated : prev;
    });
    setLocale(next);
  };

  return (
    <div role="group" aria-label={t.nav.language} className={cn("flex items-center text-sm", className)}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className="px-1 text-muted-foreground">/</span>}
          <button
            type="button"
            lang={l}
            onClick={() => change(l)}
            aria-pressed={l === locale}
            title={DICTIONARIES[l].langName}
            className={cn(
              "uppercase transition-colors",
              l === locale ? "font-semibold text-ink" : "text-muted-foreground hover:text-ink"
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}

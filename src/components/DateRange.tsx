"use client";

import { format, isValid } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useI18n } from "@/i18n/I18nProvider";

const DATE_LOCALES = { en: enUS, fr };

/** "September 2022 – June 2023" / "septembre 2022 – aujourd’hui", in the resume language. */
export function DateRange({ start, end }: { start?: string; end?: string }) {
  const { locale, t } = useI18n();
  const fmt = (v?: string) => {
    if (!v) return "";
    if (v === "currently") return t.resume.present;
    const d = new Date(v);
    return isValid(d) ? format(d, "MMMM yyyy", { locale: DATE_LOCALES[locale] }) : v;
  };
  const from = fmt(start);
  const to = fmt(end);
  return (
    <span className="whitespace-nowrap text-xs font-bold first-letter:uppercase">
      {from}
      {from && to && " – "}
      {to}
    </span>
  );
}

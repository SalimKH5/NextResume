"use client";

import { Cake, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { format, isValid } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";

const DATE_LOCALES = { en: enUS, fr };

const PersonalInfoDetail = () => {
  const { information, fontOptions } = useDragDrop();
  const { locale } = useI18n();
  const oneLine = !!fontOptions.displayOneLine;

  const birthday = information?.birthday ? new Date(information.birthday) : null;
  const rows: { key: string; icon: LucideIcon; value?: string; show: boolean }[] = [
    { key: "email", icon: Mail, value: information.email?.label, show: !!information.email?.display },
    { key: "phone", icon: Phone, value: information.phonenumber?.label, show: !!information.phonenumber?.display },
    { key: "location", icon: MapPin, value: information.locations?.label, show: !!information.locations?.display },
    {
      key: "birthday",
      icon: Cake,
      value: birthday && isValid(birthday) ? format(birthday, "d MMMM yyyy", { locale: DATE_LOCALES[locale] }) : undefined,
      show: true,
    },
  ];

  return (
    <ul className={oneLine ? "flex w-full flex-wrap items-center gap-x-4 gap-y-1.5" : "flex w-full flex-col gap-2"}>
      {rows
        .filter((r) => r.show && r.value)
        .map(({ key, icon: Icon, value }, i) => (
          <li
            key={key}
            className="flex min-w-0 items-center gap-2"
            style={oneLine && i > 0 ? { borderLeft: "1px solid currentColor", paddingLeft: 16, borderColor: "rgba(127,127,127,0.45)" } : undefined}
          >
            <Icon size={14} strokeWidth={2} className="shrink-0 opacity-80" aria-hidden="true" />
            <span className="break-words">{value}</span>
          </li>
        ))}
    </ul>
  );
};

export default PersonalInfoDetail;

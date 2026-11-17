"use client";

import Educations from "../Educations";
import Expriences from "../Expriences";
import Languages from "../Languges";
import Skills from "../Skills";
import IntersetComponent from "../IntersetComponent";

/* ---------- sections ---------- */

export type SectionKind = "languages" | "experience" | "education" | "skills" | "interests";

const SECTION_COMPONENT: Record<SectionKind, () => React.ReactNode> = {
  languages: () => <Languages />,
  experience: () => <Expriences />,
  education: () => <Educations />,
  skills: () => <Skills />,
  interests: () => <IntersetComponent />,
};

/** Canonical drop id per section, so a section can only be on the page once. */
export const SECTION_ID: Record<SectionKind, string> = {
  languages: "Languges-1",
  experience: "WorkExpricence",
  education: "education-1",
  skills: "Skills-2",
  interests: "Interst-2",
};

export function sectionKindOf(id: string): SectionKind | null {
  const s = id.toLowerCase();
  if (s.includes("lang")) return "languages";
  if (s.includes("expr") || s.includes("exper")) return "experience";
  if (s.includes("educ")) return "education";
  if (s.includes("skill")) return "skills";
  if (s.includes("inter")) return "interests";
  return null;
}

export const sectionItem = (kind: SectionKind): DroppedItem => ({
  id: SECTION_ID[kind],
  component: SECTION_COMPONENT[kind](),
});

/* ---------- layout (de)serialisation ---------- */

/** zoneId -> page -> section kinds, in order. JSON-safe. */
export type ZoneLayout = Record<string, Record<string, SectionKind[]>>;

export type SavedLayout = {
  template: string;
  style: OptionsStyle;
  zones: ZoneLayout;
};

export function serializeZones(map: DroppedItemsMap): ZoneLayout {
  const out: ZoneLayout = {};
  Object.entries(map).forEach(([zone, pages]) => {
    out[zone] = {};
    Object.entries(pages ?? {}).forEach(([page, items]) => {
      out[zone][page] = (items ?? [])
        .map((i) => sectionKindOf(i.id))
        .filter((k): k is SectionKind => !!k);
    });
  });
  return out;
}

export function deserializeZones(zones: ZoneLayout): DroppedItemsMap {
  const out: DroppedItemsMap = {};
  const seen = new Set<SectionKind>();
  Object.entries(zones ?? {}).forEach(([zone, pages]) => {
    out[zone] = {};
    Object.entries(pages ?? {}).forEach(([page, kinds]) => {
      out[zone][Number(page)] = (kinds ?? [])
        .filter((k) => k in SECTION_COMPONENT && !seen.has(k) && (seen.add(k), true))
        .map(sectionItem);
    });
  });
  return out;
}


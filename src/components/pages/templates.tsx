"use client";

import Educations from "../Educations";
import Expriences from "../Expriences";
import Languages from "../Languges";
import Skills from "../Skills";
import IntersetComponent from "../IntersetComponent";
import TemplatesOne from "./TemplatesOne";
import TemplatesTwo from "./TemplatesTwo";
import TemplatesThird from "./TemplatesThird";
import { makeFlexTemplate } from "./FlexTemplate";

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

/* ---------- templates ---------- */

/** Schematic used to draw the picker thumbnail. */
export type Thumb = {
  layout: "sidebar-left" | "sidebar-right" | "band-split" | "single" | "banner";
  fill: string;
  accent: string;
};

export type TemplateDef = {
  key: string;
  label: string;
  description: string;
  template: TemplateComponentType;
  style: OptionsStyle;
  zones: ZoneLayout;
  thumb: Thumb;
};

const base: OptionsStyle = {
  font: "Arial, sans-serif",
  textSize: 14,
  titleSize: 18,
  fontweight: 700,
  paddingHorizontal: 3,
  paddingVertical: 2,
  maxContentWidth: 10,
  SpaceContent: 18,
  SpaceInside: 10,
};

const StudioTemplate = makeFlexTemplate("studio");
const RailTemplate = makeFlexTemplate("rail");
const ExecutiveTemplate = makeFlexTemplate("executive");
const BannerTemplate = makeFlexTemplate("banner");

export const TEMPLATES: TemplateDef[] = [
  {
    key: "classic",
    label: "Classic",
    description: "Dark sidebar with photo, resizable column.",
    template: TemplatesOne,
    style: { ...base, BackgroundColor: "#333333", primaryColor: "#FFFFFF", secondColor: "#479099", titleSize: 20, SpaceContent: 20 },
    zones: { "zone-B": { 1: ["education", "experience"] }, "zone-A": { 1: ["languages", "skills", "interests"] } },
    thumb: { layout: "sidebar-left", fill: "#333333", accent: "#479099" },
  },
  {
    key: "sidebar-accent",
    label: "Sidebar accent",
    description: "Light layout, skills in the main column.",
    template: TemplatesTwo,
    style: { ...base, BackgroundColor: "#333333", primaryColor: "#000000", secondColor: "#479099", titleSize: 20, SpaceContent: 20 },
    zones: { "zone-B": { 1: ["education", "experience", "skills"] }, "zone-A": { 1: ["languages", "interests"] } },
    thumb: { layout: "sidebar-left", fill: "#e9eeee", accent: "#479099" },
  },
  {
    key: "minimal",
    label: "Minimal",
    description: "One column, contact details on one line.",
    template: TemplatesThird,
    style: {
      ...base, BackgroundColor: "#333333", primaryColor: "#000000", secondColor: "#479099",
      paddingHorizontal: 6, SpaceContent: 10, diplayDateLine: true, diplayLanguageLine: true, displayOneLine: true,
    },
    zones: { "zone-A": { 1: ["skills", "experience", "education", "languages", "interests"] } },
    thumb: { layout: "single", fill: "#ffffff", accent: "#479099" },
  },
  {
    key: "studio",
    label: "Studio",
    description: "Ink header band, mint accents, tinted side column.",
    template: StudioTemplate,
    style: { ...base, font: "Helvetica, Arial, sans-serif", BackgroundColor: "#06191b", primaryColor: "#ffffff", secondColor: "#0a9e73", displayOneLine: true },
    zones: { "zone-B": { 1: ["experience", "education"] }, "zone-A": { 1: ["skills", "languages", "interests"] } },
    thumb: { layout: "band-split", fill: "#06191b", accent: "#17e2a5" },
  },
  {
    key: "right-rail",
    label: "Right rail",
    description: "Content first, photo and details on the right.",
    template: RailTemplate,
    style: { ...base, font: "Verdana, sans-serif", textSize: 13, BackgroundColor: "#1e3a5f", primaryColor: "#ffffff", secondColor: "#2563a8" },
    zones: { "zone-B": { 1: ["experience", "education"] }, "zone-A": { 1: ["skills", "languages", "interests"] } },
    thumb: { layout: "sidebar-right", fill: "#1e3a5f", accent: "#2563a8" },
  },
  {
    key: "executive",
    label: "Executive",
    description: "Centered serif header, single column. Suits senior roles.",
    template: ExecutiveTemplate,
    style: {
      ...base, font: "Georgia, serif", BackgroundColor: "#1a1a1a", primaryColor: "#1a1a1a", secondColor: "#8a6a2f",
      displayOneLine: true, diplayDateLine: true, diplayLanguageLine: true,
    },
    zones: { "zone-B": { 1: ["experience", "education", "skills"] }, "zone-A": { 1: ["languages", "interests"] } },
    thumb: { layout: "single", fill: "#1a1a1a", accent: "#8a6a2f" },
  },
  {
    key: "banner",
    label: "Banner",
    description: "Colored header with photo, two columns below.",
    template: BannerTemplate,
    style: { ...base, font: "Trebuchet MS, sans-serif", BackgroundColor: "#0f766e", primaryColor: "#ffffff", secondColor: "#0f766e", displayOneLine: true },
    zones: { "zone-B": { 1: ["experience", "education"] }, "zone-A": { 1: ["skills", "languages", "interests"] } },
    thumb: { layout: "banner", fill: "#0f766e", accent: "#0f766e" },
  },
];

export const DEFAULT_TEMPLATE_KEY = "classic";

export const templateByKey = (key?: string) =>
  TEMPLATES.find((t) => t.key === key) ?? TEMPLATES[0];

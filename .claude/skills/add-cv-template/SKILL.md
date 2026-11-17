---
name: add-cv-template
description: Add a new resume (CV) template to NextResume end to end: layout, registry entry, picker thumbnail, EN/FR labels, and the checks every template must pass. Use when asked for a new template, layout or CV design.
---

# Add a CV template

Templates live in a registry; the editor, picker, saving and undo all read from it. Do not add a template anywhere else.

## 1. Layout

Prefer a new variant of the configurable layout in `src/components/pages/FlexTemplate.tsx`:

- Add the variant name to `FlexVariant` and a `case` in `renderPage`.
- Page 1 shows the header (`FullName`, job title, `PersonalInfoDetail`, `ProfilePhoto` when `information.picture.display`); every page renders `<DropZone zoneId="zone-A" page={page} />` and/or `zone-B`.
- Colour roles come from `fontOptions`: `BackgroundColor` = fill (band/rail), `primaryColor` = text on the fill, `secondColor` = accent. Pass `onDark` to `ProfilePhoto` on dark fills.
- Section titles on a dark fill must stay readable: add a `[&_h3]:!text-[var(--on-fill)]` override like the `rail` variant does (section titles are h3).
- Every template must show the photo when it's enabled.

Only write a fully custom component (like `TemplatesOne.tsx`) if FlexTemplate genuinely can't express the layout. It must then handle pages, overflow (`OverflowNotice`) and the `scale === 0.43` mobile class the same way.

## 2. Registry entry

In `src/components/pages/templates.tsx` add to `TEMPLATES`:

```ts
{
  key: "my-template",              // stable: it is saved in the database
  label: "My template",            // fallback; the real label comes from i18n
  description: "One line, what is distinctive.",
  template: MyTemplate,            // const MyTemplate = makeFlexTemplate("my-variant");
  style: { ...base, font: "'Inter Variable', Arial, sans-serif", BackgroundColor: "#...", primaryColor: "#...", secondColor: "#..." },
  zones: { "zone-B": { 1: ["experience", "education"] }, "zone-A": { 1: ["skills", "languages", "interests"] } },
  thumb: { layout: "band-split", fill: "#...", accent: "#..." },
}
```

- Fonts must come from `src/fonts/resumeFonts.ts` (`RESUME_FONTS`) so they print.
- Each of the five section kinds appears at most once across zones.
- Use an existing `thumb.layout` or add a new drawing in `TemplateThumb` (`TemplateSelector.tsx`).

## 3. Labels (EN + FR)

Add `templates["my-template"] = { label, desc }` to both `en` and `fr` in `src/i18n/dictionaries.ts`.

## 4. Contrast

Check text colours with the WCAG formula (body text ≥ 4.5:1; section titles ≥ 3:1 only if bold and ≥ 18.66px). Accent on white and on the fill both count.

## 5. Checks

Use the `editor-preview` skill and confirm, for the new template:

- no overlapping sections (each zone's sections stack, see the overlap script there),
- the photo shows (uploaded photo and initials fallback),
- all five add-entry popups open, adding + undo works,
- the print simulation shows 0 buttons and 0 `[data-editor-only]` elements,
- then run the `verify` skill.

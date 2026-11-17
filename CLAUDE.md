# NextResume

Resume builder: Next.js 15 (App Router) + React 19 + TypeScript, Tailwind v4, NextAuth (Google) + MongoDB. Users pick a template, edit sections in a drag-and-drop editor and print to PDF with `react-to-print`.

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` (Turbopack, writes to `.next-dev`) |
| Production build / serve | `npm run build` / `npm start` (writes to `.next`, what Vercel uses) |
| Type-check | `npx tsc --noEmit` |
| Lint | `npm run lint` (must report 0 errors; warnings are legacy) |
| Isolated verification build | `NEXT_DIST_DIR=.next-verify npm run build` (see the `verify` skill) |

CI (`.github/workflows/ci.yml`) runs lint, type-check and build. Required env: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## Rules

- **Git:** commits and PRs are authored by the owner only. Never add `Co-Authored-By: Claude`, "Generated with Claude Code" or any AI attribution. Commit on a feature branch, never push or merge without being asked.
- **Never touch `.next` or `.next-dev`** while the user may be running `npm start` / `npm run dev`. Verify with `NEXT_DIST_DIR=.next-verify`, then `git checkout -- tsconfig.json` (Next rewrites it) and delete the folder. Stop test servers **by port only**, never by matching "NextResume" in process command lines.
- **Every UI string goes through i18n**: add it to both `en` and `fr` in `src/i18n/dictionaries.ts` (the `fr` object is typed by `en`, so a missing key fails type-check).
- **Nothing editor-only may print.** Wrap editor chrome in `className="no-print"` and/or `data-editor-only`; inside `#template` the print rule in `globals.css` also hides `.nr-actions` and `[role="toolbar"]`.
- **Accessibility is a requirement** (an audit was done): real `<label>`s, named icon buttons (`IconButton` in `src/components/editor/Tip.tsx`), keyboard alternatives for every drag, text contrast ≥ 4.5:1, focus ring stays ink + mint halo.
- Resume headings: h1 = resume name (editor bar), h2 = person's name, h3 = section titles (`SectionTitle`), h4 = entries.

## Architecture

```
src/app
  layout.tsx                 fonts, I18nProvider, AuthProvider, DragDropProvider, skip link,
                             inline script that removes foreign service workers (see Gotchas)
  page.tsx / Auth / not-found   public pages (server components, getDictionary())
  [locale]/dashboard|edit-profile   account area ("locale" is a literal path segment today)
  cv-editions/[id_template]  editor: server component reads the CV from Mongo, renders MainTemplate
  api/CvtTmplates            CV CRUD (scoped to the session user; PUT also stores `layout`)
  api/user                   profile read/update (whitelisted fields)
src/components
  DraggableContext.tsx       editor state: information, fontOptions (style), droppedItems (zones), templateKey
  MainTemplate.tsx           load/save (debounced PUT), editor bar (undo/redo, zoom), canvas
  SidebarApp.tsx             tool rail + panels (Details, Templates, Style, Sections)
  DropZone.tsx               a drop column; section frames + floating section toolbar
  pages/templates.tsx        TEMPLATE REGISTRY (key, style, default zones, thumbnail)
  pages/sections.tsx         section kinds, canonical ids, (de)serialize zones
  pages/FlexTemplate.tsx     configurable layout used by Studio / Right rail / Executive / Banner
  pages/Templates{One,Two,Third}.tsx   original Classic / Sidebar accent / Minimal layouts
  editor/dnd.ts              drag store, autoscroll while dragging, section ops (place/remove/append)
  editor/useHistory.ts       undo/redo snapshots
  editor/EntryDialog.tsx     shared add/edit popup + useEntryForm + nextId
  ProfilePhoto.tsx           photo (upload → square JPEG data URL in information.picture.label), initials fallback
src/i18n                     dictionaries.ts (en/fr), I18nProvider (client), server.ts (cookie `nr-locale`)
src/fonts/resumeFonts.ts     self-hosted resume fonts (fontsource), imported by the editor only
```

Saved per resume: `informations` (content) and `layout = { template, style, zones }`. Zones are stored as section kinds (`ZoneLayout`), never React elements.

## Gotchas

- **Stale dev UI on localhost:3000** = a service worker from another project (`sw.js`, cache `flexo1-interface-v2`) serving old `/_next/static` chunks. Dev chunk names are not content-hashed, a build's are, so dev looks old while build looks right. `layout.tsx` removes foreign workers; check `navigator.serviceWorker.getRegistrations()` before suspecting code.
- Turbopack's file watcher on Windows sometimes misses edits; restart `npm run dev` if the server output doesn't change.
- Entry ids must come from `nextId()` (max + 1). `length + 1` produced duplicate ids after deletions.
- SortableJS list reordering goes through `useSortableList` (moves the DOM node back and reorders state). Never let Sortable mutate the DOM React owns.
- Dynamic Tailwind classes such as `gap-${n}` are not generated; use inline styles for computed values.

## Skills in this repo

- `verify`: type-check, lint and an isolated production build without disturbing running servers.
- `add-cv-template`: add a resume template end to end (registry, thumbnail, i18n, checks).
- `editor-preview`: look at and test the editor without signing in, including a PDF/print simulation.

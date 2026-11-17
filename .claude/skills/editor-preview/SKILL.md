---
name: editor-preview
description: See and test the NextResume CV editor in a browser without Google sign-in or MongoDB, including a PDF (print) simulation and an overlap check. Use to visually check or smoke-test editor, template or print changes.
---

# Preview and test the editor without signing in

The real editor (`/cv-editions/[id]`) needs a session and a database. For checks, add a **temporary** page that renders `MainTemplate` with the context's demo data. Delete it before committing.

## 1. Temporary page

`src/app/zz-preview/page.tsx` (never commit it):

```tsx
"use client";
// TEMPORARY visual-check page. Not committed.
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import MainTemplate from "@/components/MainTemplate";
import { Navbar1 } from "@/components/Navbar";
import { useDragDrop } from "@/components/DraggableContext";

function Inner() {
  const t = useSearchParams().get("t") ?? "studio";           // template key
  const empty = useSearchParams().get("empty") === "1";       // empty Experience/Education
  const { information } = useDragDrop();
  const [snap] = useState(() => (empty ? { ...information, Expriences: [], Educations: [] } : information));
  return (
    <>
      <Navbar1 />
      <main id="main" tabIndex={-1}>
        <MainTemplate key={t} info={{ _id: "preview-" + t, user_id: "x", id_template: 1, title_template: "Preview resume", informations: snap, layout: { template: t, style: {}, zones: undefined } as unknown }} />
      </main>
    </>
  );
}
export default function Page() {
  return <Suspense><Inner /></Suspense>;
}
```

Build and serve it with the `verify` skill's isolated build (`NEXT_DIST_DIR=.next-verify`), then `next start -p 3137` with the same env. Open `http://localhost:3137/zz-preview?t=<key>`. "Not saved" in the editor bar is expected (no session).

## 2. Scripted checks (run in the page with the browser tool)

- **Simulated drag**: real mouse drags can't trigger native HTML5 drag and drop from automation. Dispatch `pointerdown` on the section title, then `DragEvent`s (`dragstart` on the section, `dragover`/`drop` on the target zone with `clientY`, `dragend`) sharing one `DataTransfer`.
- **React inputs**: set values through the native setter, then dispatch `input`:
  `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el, v); el.dispatchEvent(new Event('input',{bubbles:true}))`.
- **Overlap check**: group `#template [data-section]` by their column and assert each `getBoundingClientRect().top` ≥ the previous `bottom`.
- **Print simulation** (what `react-to-print` produces): create an iframe, copy every `link[rel=stylesheet]` and `style` into it, append a `<style>` containing the inner rules of every `@media print` rule from `document.styleSheets`, clone `#template` into it, then count visible `button` and `[data-editor-only]` elements (both must be 0).
- **Console**: read errors; `chrome-extension://` "Untrusted event" errors come from a browser extension reacting to synthetic key events and are not app errors.

## 3. Clean up

Stop the server by port, delete `src/app/zz-preview` and `.next-verify`, restore `tsconfig.json`, confirm `git status` shows neither.

The language cookie (`nr-locale`) is shared by every `localhost` port: if a test switches language, switch it back before finishing.

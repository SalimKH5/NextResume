import type { Metadata } from "next";
// DM Sans is bundled with the app (no Google Fonts download at build/dev time,
// which failed intermittently with Turbopack).
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { DragDropProvider } from "@/components/DraggableContext";
import { AuthProvider } from "./providers";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getLocale } from "@/i18n/server";
import { DICTIONARIES } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: { default: "NextResume — build your resume", template: "%s · NextResume" },
  description:
    "Build a clean, professional resume in minutes: pick a template, drag in your sections and download a PDF.",
};

/**
 * NextResume has no service worker. A worker left on the same origin by another
 * app (e.g. one that ran on localhost:3000 before) intercepts /_next/static and
 * serves stale chunks: dev then shows old code while a production build (hashed
 * file names) looks right. Remove any worker + its caches, then reload once.
 * Inline on purpose: the HTML comes from the server, so this always runs, while
 * a JS chunk could itself be served stale by the worker.
 */
const CLEAR_FOREIGN_SERVICE_WORKERS = `(function () {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.getRegistrations().then(function (regs) {
    if (!regs.length) return;
    var key = "nr-sw-cleared";
    Promise.all(regs.map(function (r) { return r.unregister(); }))
      .then(function () { return window.caches ? caches.keys().then(function (k) { return Promise.all(k.map(function (n) { return caches.delete(n); })); }) : null; })
      .then(function () {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
        location.reload();
      });
  });
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: CLEAR_FOREIGN_SERVICE_WORKERS }} />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen">
        <a href="#main" className="nr-skip">
          {DICTIONARIES[locale].nav.skip}
        </a>
        <I18nProvider initialLocale={locale}>
          <AuthProvider>
            <DragDropProvider>{children}</DragDropProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

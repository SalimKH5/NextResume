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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
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

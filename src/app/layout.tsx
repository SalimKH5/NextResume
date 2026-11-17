import type { Metadata } from "next";
// DM Sans is bundled with the app (no Google Fonts download at build/dev time,
// which failed intermittently with Turbopack).
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { DragDropProvider } from "@/components/DraggableContext";
import { AuthProvider } from "./providers";

export const metadata: Metadata = {
  title: { default: "NextResume — build your resume", template: "%s · NextResume" },
  description:
    "Build a clean, professional resume in minutes: pick a template, drag in your sections and download a PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased min-h-screen">
        <AuthProvider>
          <DragDropProvider>{children}</DragDropProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

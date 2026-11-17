import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { DragDropProvider } from "@/components/DraggableContext";
import { AuthProvider } from "./providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-dm-sans",
});

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
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased min-h-screen">
        <AuthProvider>
          <DragDropProvider>{children}</DragDropProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

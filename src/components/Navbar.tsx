"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useReactToPrint } from "react-to-print";
import { Menu, X } from "lucide-react";
import { Logo } from "./brand/Logo";
import { useDragDrop } from "./DraggableContext";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageSwitch } from "./LanguageSwitch";

const useNav = () => {
  const { t } = useI18n();
  return [
    { title: t.nav.templates, href: "/#templates" },
    { title: t.nav.howItWorks, href: "/#how-it-works" },
  ];
};


const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume";

/** Download-PDF action, only rendered in the editor. */
function DownloadPdf() {
  const { t } = useI18n();
  const { containerRef, setScale, lockScale, unlockScale, information } = useDragDrop();
  const print = useReactToPrint({
    contentRef: containerRef,
    documentTitle: slugify(information?.title ?? "resume"),
    onBeforePrint: async () => {
      lockScale();
      setScale(1);
      await new Promise((r) => setTimeout(r, 0));
    },
    onAfterPrint: () => unlockScale(),
  });
  return (
    <button type="button" onClick={() => print()} className="nr-cta text-sm sm:text-base">
      {t.nav.downloadPdf}
    </button>
  );
}

function AccountAction() {
  const { status } = useSession();
  const { t } = useI18n();
  if (status === "loading") {
    return <span className="block h-6 w-28 animate-pulse rounded bg-muted" />;
  }
  if (status === "authenticated") {
    return (
      <Link href="/locale/dashboard" className="nr-cta text-sm sm:text-base">
        {t.nav.myResumes}
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => signIn()} className="nr-cta text-sm sm:text-base">
      {t.nav.signIn}
    </button>
  );
}

export function Navbar1() {
  const pathname = usePathname();
  const inEditor = pathname.startsWith("/cv-editions");
  const [open, setOpen] = useState(false);
  const NAV = useNav();
  const { t } = useI18n();

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm",
        inEditor && "border-b border-line bg-background"
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-6 px-4 sm:px-8",
          inEditor ? "h-16 max-w-none" : "h-20 max-w-[1440px] lg:px-[5.5%]"
        )}
      >
        <Logo className={inEditor ? "text-[1.75rem]" : undefined} />

        {!inEditor && (
          <nav aria-label="Main" className="hidden md:flex items-center gap-12">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nr-nav-link">
                {item.title}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-6">
          <LanguageSwitch className="hidden sm:flex" />
          {inEditor && <DownloadPdf />}
          <AccountAction />
          {!inEditor && (
            <button
              type="button"
              className="md:hidden -mr-2 p-2"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}
        </div>
      </div>

      {!inEditor && open && (
        <nav aria-label="Main" className="md:hidden border-t border-line px-4 py-4 flex flex-col gap-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nr-nav-link self-start"
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          <LanguageSwitch className="pt-2" />
        </nav>
      )}
    </header>
  );
}

export default Navbar1;

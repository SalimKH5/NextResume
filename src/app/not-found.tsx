import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar1 } from "@/components/Navbar";
import { Backdrop, DotTitle } from "@/components/brand/Backdrop";
import { getDictionary } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getDictionary();
  return (
    <>
      <Navbar1 />
      <main className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <Backdrop />
        <p className="text-sm text-muted-foreground">
          <span className="text-mint-deep">/</span>404
        </p>
        <DotTitle className="mt-4 text-[clamp(3rem,10vw,7.5rem)]">{t.notFound.title}</DotTitle>
        <p className="mt-6 max-w-md text-lg text-ink/85">
          {t.notFound.lead}
        </p>
        <Link href="/" className="nr-cta mt-10 text-lg">
          {t.notFound.back} <ArrowRight className="size-5" strokeWidth={2.5} />
        </Link>
      </main>
    </>
  );
}

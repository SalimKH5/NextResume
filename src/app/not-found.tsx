import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar1 } from "@/components/Navbar";
import { Backdrop, DotTitle } from "@/components/brand/Backdrop";

export default function NotFound() {
  return (
    <>
      <Navbar1 />
      <main className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <Backdrop />
        <p className="text-sm text-muted-foreground">
          <span className="text-mint-deep">/</span>404
        </p>
        <DotTitle className="mt-4 text-[clamp(3rem,10vw,7.5rem)]">Page not found</DotTitle>
        <p className="mt-6 max-w-md text-lg text-ink/85">
          The link may be broken, or the page was moved.
        </p>
        <Link href="/" className="nr-cta mt-10 text-lg">
          Back to home <ArrowRight className="size-5" strokeWidth={2.5} />
        </Link>
      </main>
    </>
  );
}

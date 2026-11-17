import Link from "next/link";
import { cn } from "@/lib/utils";

/** "/nr" wordmark: mint slash + ink letters. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="NextResume home"
      className={cn(
        "inline-flex items-baseline text-[2.1rem] leading-none font-semibold tracking-[-0.06em] text-ink",
        className
      )}
    >
      <span className="text-mint -mr-[0.02em] font-medium">/</span>
      nr
    </Link>
  );
}

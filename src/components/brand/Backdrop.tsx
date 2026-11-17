import { cn } from "@/lib/utils";

/** Grid floor + room lines + mint glow, placed behind a hero. */
export function Backdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden -z-10", className)}>
      <div className="nr-room" />
      <div className="nr-floor" />
    </div>
  );
}

/** A heading that ends in a mint dot, the period of the brand. */
export function DotTitle({
  children,
  className,
  as: Tag = "h1",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className={cn("nr-display text-ink", className)}>
      {children}
      <span
        aria-hidden="true"
        className="inline-block size-[0.16em] rounded-full bg-mint ml-[0.05em] align-baseline"
      />
    </Tag>
  );
}

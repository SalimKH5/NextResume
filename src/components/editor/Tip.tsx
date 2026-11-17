"use client";

import { forwardRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"button"> & {
  label: string;
  /** Optional keyboard shortcut shown in the tooltip, e.g. "Ctrl+Z". */
  shortcut?: string;
  side?: "top" | "right" | "bottom" | "left";
};

/** Icon button with an accessible name and a tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { label, shortcut, side = "bottom", className, children, ...props },
  ref
) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          className={cn(
            "grid size-8 place-items-center rounded-md text-ink transition-colors hover:bg-mint-wash disabled:pointer-events-none disabled:opacity-35",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="no-print">
        {label}
        {shortcut && <kbd className="ml-2 font-sans opacity-70">{shortcut}</kbd>}
      </TooltipContent>
    </Tooltip>
  );
});

/** Tooltip around any element that is already focusable. */
export function Tip({ label, side = "right", children }: { label: string; side?: Props["side"]; children: React.ReactElement }) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className="no-print">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

import { useState } from "react";
import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Brand lockup: the supplied logo mark (proportions preserved via aspect-square)
 * alongside the wordmark, with fallback to a clean Lucide receipt icon.
 */
export function Logo({
  className,
  markClassName,
  textClassName,
  showText = true,
  showTagline = false,
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {!imgError ? (
        <img
          src="/favicon.png"
          alt="Expense Organizer logo"
          className={cn(
            "h-9 w-auto aspect-square shrink-0 rounded-md object-contain",
            markClassName,
          )}
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className={cn(
            "flex h-9 aspect-square shrink-0 items-center justify-center rounded-md bg-positive/20 text-positive border border-positive/30",
            markClassName,
          )}
          aria-label="Expense Organizer logo"
        >
          <Receipt className="h-3/5 w-3/5" />
        </span>
      )}
      {showText && (
        <span className="min-w-0">
          <span
            className={cn(
              "font-display block truncate text-base font-semibold text-white",
              textClassName,
            )}
          >
            Expense Organizer
          </span>
          {showTagline && (
            <span className="block text-[11px] text-slate-400">Automated receipt management</span>
          )}
        </span>
      )}
    </span>
  );
}

import markAsset from "@/assets/expense-organizer-mark.jpg.asset.json";
import { cn } from "@/lib/utils";

/**
 * Brand lockup: the supplied logo mark (proportions preserved via `w-auto`)
 * alongside the wordmark.
 */
export function Logo({
  className,
  markClassName,
  textClassName,
  showText = true,
  showTagline = false,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <img
        src={markAsset.url}
        alt="Expense Organizer logo"
        className={cn("h-9 w-auto rounded-md object-contain", markClassName)}
      />
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

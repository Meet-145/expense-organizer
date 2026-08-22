import logoAsset from "@/assets/expense-organizer-logo.jpg.asset.json";
import { cn } from "@/lib/utils";

/**
 * Brand lockup. The supplied logo already contains the wordmark, so it is used
 * as a single image (proportions preserved via `h-* w-auto`).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Expense Organizer — automated receipt management"
      className={cn("h-9 w-auto rounded-md object-contain", className)}
    />
  );
}

import { CheckCircle2, CircleAlert, TriangleAlert } from "lucide-react";
import { confidenceLevel } from "@/services/receipt-extraction";
import { cn } from "@/lib/utils";

export function ConfidenceBadge({ score, className }: { score?: number; className?: string }) {
  if (typeof score !== "number") return null;
  const level = confidenceLevel(score);
  const map = {
    high: { icon: CheckCircle2, cls: "bg-positive/10 text-positive", label: "Verified" },
    medium: { icon: CircleAlert, cls: "bg-warning/15 text-warning", label: "Please review" },
    low: { icon: TriangleAlert, cls: "bg-destructive/10 text-destructive", label: "Needs attention" },
  } as const;
  const { icon: Icon, cls, label } = map[level];

  return (
    <span
      title={`Extraction certainty: ${(score * 100).toFixed(0)}%`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        cls,
        className,
      )}
    >
      <Icon className="size-3" />
      {label} · {(score * 100).toFixed(0)}%
    </span>
  );
}

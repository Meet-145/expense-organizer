import { CheckCircle2, CircleAlert, TriangleAlert } from "lucide-react";
import { confidenceLevel } from "@/services/receipt-extraction";
import { cn } from "@/lib/utils";

export function ConfidenceBadge({ score, className }                                        ) {
  if (typeof score !== "number") return null;
  const level = confidenceLevel(score);
  const map = {
    high: { icon: CheckCircle2, cls: "bg-positive/10 text-positive", label: "Verified" },
    medium: { icon: CircleAlert, cls: "bg-warning/15 text-warning", label: "Please review" },
    low: { icon: TriangleAlert, cls: "bg-destructive/10 text-destructive", label: "Needs attention" },
  }         ;
  const { icon: Icon, cls, label } = map[level];

  return (
    <span
      title={`Extraction certainty: ${(score * 100).toFixed(0)}%`}
      className={

       }
    >
      <Icon className="size-3" />
      {label} · {(score * 100).toFixed(0)}%
    </span>
  );
}

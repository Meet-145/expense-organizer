import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  hint,
  positiveIsDown = true,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: number;
  hint?: string;
  positiveIsDown?: boolean;
}) {
  const up = (change ?? 0) >= 0;
  const good = positiveIsDown ? !up : up;

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
            <Icon className="size-4.5" />
          </div>
        </div>
        <p className="font-display mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          {value}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {typeof change === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                good ? "bg-positive/10 text-positive" : "bg-destructive/10 text-destructive",
              )}
            >
              {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
          {hint && <span className="text-slate-500">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

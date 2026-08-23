import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { STAGE_LABELS, type ProcessingStage } from "@/services/receipt-extraction";
import { cn } from "@/lib/utils";

const ORDER: ProcessingStage[] = ["uploading", "ocr", "understanding", "structuring", "validating", "done"];

export function ProcessingStatus({
  stage,
  progress,
}: {
  stage: ProcessingStage;
  progress: number;
}) {
  const currentIndex = ORDER.indexOf(stage);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-900">{STAGE_LABELS[stage]}</span>
          <span className="text-slate-500">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <ol className="space-y-3">
        {ORDER.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                active
                  ? "border-brand/40 bg-brand/5 text-slate-900"
                  : done
                    ? "border-positive/30 bg-positive/5 text-slate-700"
                    : "border-slate-200 bg-white text-slate-400",
              )}
            >
              {done ? (
                <CheckCircle2 className="size-4 text-positive" />
              ) : active ? (
                <Loader2 className="size-4 animate-spin text-brand" />
              ) : (
                <Circle className="size-4" />
              )}
              {STAGE_LABELS[s]}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

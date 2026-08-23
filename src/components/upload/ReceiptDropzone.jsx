import { useCallback, useRef, useState } from "react";
import { FileUp, ImageIcon, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { validateFile } from "@/services/receipt-extraction";

export function ReceiptDropzone({
  onFileReady,
  onDemo,
}

 ) {
  const inputRef = useRef                  (null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState               (null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(
    (file      ) => {
      setError(null);
      const problem = validateFile(file);
      if (problem) {
        setError(problem);
        return;
      }
      setBusy(true);
      setProgress(0);
      // Simulated chunked upload progress.
      let pct = 0;
      const timer = setInterval(() => {
        pct = Math.min(100, pct + 12 + Math.random() * 18);
        setProgress(Math.round(pct));
        if (pct >= 100) {
          clearInterval(timer);
          setBusy(false);
          onFileReady(file, URL.createObjectURL(file));
        }
      }, 140);
    },
    [onFileReady],
  );

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && inputRef.current?.click()}
        onClick={() => inputRef.current?.click()}
        onDragOver={(ev) => {
          ev.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(ev) => {
          ev.preventDefault();
          setDragging(false);
          const file = ev.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
          dragging
            ? "border-brand bg-brand/5"
            : "border-slate-300 bg-white hover:border-brand/60 hover:bg-slate-50",
        )}
      >
        <div className="grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
          <FileUp className="size-7" />
        </div>
        <p className="font-display mt-4 text-base font-semibold text-slate-900">
          Drag & drop your receipt here
        </p>
        <p className="mt-1 text-sm text-slate-500">
          or click to browse — JPG, PNG, WEBP or PDF, up to 10 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(ev) => {
            const file = ev.target.files?.[0];
            if (file) handleFile(file);
            ev.target.value = "";
          }}
        />
      </div>

      {busy && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <ImageIcon className="size-4 text-brand" /> Uploading receipt…
            </span>
            <span className="font-medium text-slate-900">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">This file couldn't be accepted</p>
            <p className="text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <span className="text-sm text-slate-500">No receipt on hand?</span>
        <Button variant="outline" onClick={onDemo} className="border-brand/40 text-brand">
          <Sparkles className="size-4" /> Try a sample receipt
        </Button>
      </div>
    </div>
  );
}

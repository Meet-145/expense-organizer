import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RefreshCw, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/layout/AppShell";
import { ProcessingStatus } from "@/components/upload/ProcessingStatus";
import { ReceiptPreview } from "@/components/upload/ReceiptPreview";
import { draftStore } from "@/services/draft-store";
import { extractReceipt, type ProcessingStage } from "@/services/receipt-extraction";

export const Route = createFileRoute("/processing")({
  head: () => ({
    meta: [
      { title: "Processing receipt — Expense Organizer" },
      { name: "description", content: "Watch the AI read your receipt field by field." },
      { property: "og:title", content: "Processing receipt — Expense Organizer" },
      { property: "og:description", content: "Watch the AI read your receipt field by field." },
    ],
  }),
  component: ProcessingPage,
});

function ProcessingPage() {
  const navigate = useNavigate();
  const draft = draftStore.get();
  const [stage, setStage] = useState<ProcessingStage>("uploading");
  const [progress, setProgress] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    setError(null);
    setStage("uploading");
    setProgress(4);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const result = await extractReceipt(draftStore.get()?.file ?? null, {
        signal: controller.signal,
        onStage: (s, p) => {
          setStage(s);
          setProgress(p);
        },
      });
      draftStore.patch({ extraction: result });
      navigate({ to: "/review" });
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : "Extraction failed. Please try again.");
    }
  }, [navigate]);

  useEffect(() => {
    if (!draftStore.get()) {
      navigate({ to: "/upload", replace: true });
      return;
    }
    void run();
    return () => abortRef.current?.abort();
  }, [run, navigate, attempt]);

  return (
    <AppShell title="Processing receipt" description="This usually takes about 10 seconds">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">
              {error ? "Extraction failed" : "AI extraction in progress"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-medium">We couldn't finish reading this receipt</p>
                    <p className="text-destructive/80">{error}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setAttempt((a) => a + 1)}
                    className="bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    <RefreshCw className="size-4" /> Retry extraction
                  </Button>
                  <Button variant="outline" onClick={() => navigate({ to: "/upload" })}>
                    Upload a different receipt
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <ProcessingStatus stage={stage} progress={progress} />
                <Button
                  variant="ghost"
                  className="mt-6 text-slate-500"
                  onClick={() => {
                    abortRef.current?.abort();
                    draftStore.clear();
                    navigate({ to: "/upload" });
                  }}
                >
                  <X className="size-4" /> Cancel
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Your receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceiptPreview previewUrl={draft?.previewUrl} fileName={draft?.fileName} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lightbulb, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/layout/AppShell";
import { ReceiptDropzone } from "@/components/upload/ReceiptDropzone";
import { draftStore } from "@/services/draft-store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload receipt — Expense Organizer" },
      {
        name: "description",
        content: "Drag and drop a receipt photo or PDF and let the AI extract every field.",
      },
      { property: "og:title", content: "Upload receipt — Expense Organizer" },
      {
        property: "og:description",
        content: "Drag and drop a receipt photo or PDF and let the AI extract every field.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();

  return (
    <AppShell title="Upload receipt" description="Photo, scan or PDF — we'll do the typing">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReceiptDropzone
            onFileReady={(file, previewUrl) => {
              draftStore.set({
                fileName: file.name,
                fileSize: file.size,
                previewUrl: file.type === "application/pdf" ? undefined : previewUrl,
                isDemo: false,
                file,
              });
              toast.success("Receipt uploaded — extracting details…");
              navigate({ to: "/processing" });
            }}
            onDemo={() => {
              draftStore.set({
                fileName: "demo-receipt-ccd-mgroad.jpg",
                fileSize: 248_000,
                isDemo: true,
              });
              toast.info("Using a sample receipt.");
              navigate({ to: "/processing" });
            }}
          />
        </div>

        <div className="space-y-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base text-slate-900">
                <Lightbulb className="size-4 text-warning" /> Tips for a clean scan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>• Flatten the receipt and shoot straight down.</p>
              <p>• Keep the GSTIN and total inside the frame.</p>
              <p>• Avoid shadows — daylight works best.</p>
              <p>• Multi-page bills: upload the PDF instead of photos.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base text-slate-900">
                <ShieldCheck className="size-4 text-positive" /> How extraction works here
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>
                This workspace runs <span className="font-medium text-slate-900">entirely in your browser</span>.
                Files never leave your browser — the extraction service returns realistic mock data.
              </p>
              <p>
                The service module is written so a real vision-model call can be dropped in behind a
                server endpoint later, without touching any of this UI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

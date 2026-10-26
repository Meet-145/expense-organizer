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
        content: "Upload a receipt photo or PDF and have every field captured automatically.",
      },
      { property: "og:title", content: "Upload receipt — Expense Organizer" },
      {
        property: "og:description",
        content: "Upload a receipt photo or PDF and have every field captured automatically.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();

  return (
    <AppShell title="Upload receipt" description="Upload a photo, scan or PDF and we'll capture the details for you">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReceiptDropzone
            onFileReady={(file, previewUrl) => {
              draftStore.set({
                fileName: file.name,
                fileSize: file.size,
                previewUrl: file.type === "application/pdf" ? undefined : previewUrl,
                file,
              });
              toast.success("Receipt uploaded. Extracting details…");
              navigate({ to: "/processing" });
            }}
          />
        </div>

        <div className="space-y-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base text-slate-900">
                <Lightbulb className="size-4 text-warning" /> Tips for an accurate capture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>• Flatten the receipt and photograph it straight on.</p>
              <p>• Keep the GSTIN and total amount fully within the frame.</p>
              <p>• Avoid shadows and glare; natural daylight works best.</p>
              <p>• For multi-page invoices, upload the PDF rather than separate photos.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base text-slate-900">
                <ShieldCheck className="size-4 text-positive" /> How extraction works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>
                Your receipt is sent to a secure server endpoint, which calls Google's Gemini vision
                model to read it. <span className="font-medium text-slate-900">Your API key never
                reaches the browser</span> — only the parsed result comes back.
              </p>
            </CardContent>

          </Card>
        </div>
      </div>
    </AppShell>
  );
}

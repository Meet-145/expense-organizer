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
                isDemo: false,
                file,
              });
              toast.success("Receipt uploaded. Extracting details…");
              navigate({ to: "/processing" });
            }}
            onDemo={() => {
              draftStore.set({
                fileName: "sample-receipt-ccd-mgroad.jpg",
                fileSize: 248_000,
                isDemo: true,
              });
              toast.info("Using a sample receipt for this extraction.");
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
                This workspace runs <span className="font-medium text-slate-900">entirely in your browser</span>.
                Your files stay on your device, and the extraction service returns realistic sample results.
              </p>
              <p>
                The extraction layer is isolated behind a service module, so a live vision model can be
                connected through a secure server endpoint without any change to this interface.
              </p>
            </CardContent>

          </Card>
        </div>
      </div>
    </AppShell>
  );
}

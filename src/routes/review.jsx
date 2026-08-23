import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/layout/AppShell";
import { ExpenseForm,                        } from "@/components/expenses/ExpenseForm";
import { ReceiptPreview } from "@/components/upload/ReceiptPreview";
import { draftStore } from "@/services/draft-store";
import { useExpenses } from "@/hooks/use-expenses";
import { uid } from "@/lib/format";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review extracted details — Expense Organizer" },
      { name: "description", content: "Verify the details extracted from your receipt before saving." },
      { property: "og:title", content: "Review extracted details — Expense Organizer" },
      {
        property: "og:description",
        content: "Verify the details extracted from your receipt before saving.",
      },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const navigate = useNavigate();
  const { create } = useExpenses();
  const draft = draftStore.get();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!draftStore.get()?.extraction) navigate({ to: "/upload", replace: true });
  }, [navigate]);

  const ex = draft?.extraction;
  if (!ex) return null;

  const initial                    = {
    merchant: ex.merchant,
    date: ex.date,
    subtotal: ex.subtotal,
    taxAmount: ex.taxAmount,
    taxRate: ex.taxRate,
    total: ex.total,
    category: ex.category,
    paymentMethod: ex.paymentMethod,
    status: "pending",
    gstin: ex.gstin,
    invoiceNumber: ex.invoiceNumber,
    lineItems: ex.lineItems,
    confidence: ex.confidence,
    source: "ai-extraction",
    receiptFileName: draft?.fileName,
    notes: "",
  };

  return (
    <AppShell
      title="Review extracted details"
      description="Verify the extracted values before saving. Fields read with lower certainty are flagged for your attention."
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Expense details</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              initial={initial}
              busy={busy}
              submitLabel="Save expense"
              onCancel={() => {
                draftStore.clear();
                navigate({ to: "/upload" });
              }}
              onSubmit={(values) => {
                setBusy(true);
                create({
                  ...values,
                  id: uid("exp"),
                  currency: "INR",
                  createdAt: new Date().toISOString(),
                });
                draftStore.clear();
                toast.success("Expense verified and saved to your records.");
                navigate({ to: "/dashboard" });
              }}
            />
          </CardContent>
        </Card>

        <Card className="h-fit border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Source document</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceiptPreview
              previewUrl={draft?.previewUrl}
              fileName={draft?.fileName}
              merchant={ex.merchant}
              gstin={ex.gstin}
              invoiceNumber={ex.invoiceNumber}
              items={ex.lineItems.map((i) => ({ label: i.description, amount: i.amount }))}
              subtotal={ex.subtotal}
              tax={ex.taxAmount}
              total={ex.total}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

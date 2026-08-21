import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/layout/AppShell";
import { ExpenseForm, type ExpenseFormValues } from "@/components/expenses/ExpenseForm";
import { ReceiptPreview } from "@/components/upload/ReceiptPreview";
import { draftStore } from "@/services/draft-store";
import { useExpenses } from "@/hooks/use-expenses";
import { uid } from "@/lib/format";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review extracted data — Expense Organizer" },
      { name: "description", content: "Check the AI's reading of your receipt before saving it." },
      { property: "og:title", content: "Review extracted data — Expense Organizer" },
      {
        property: "og:description",
        content: "Check the AI's reading of your receipt before saving it.",
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

  const initial: ExpenseFormValues = {
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
      title="Review extracted data"
      description="Fields with low confidence are flagged — fix anything that looks off"
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
                toast.success("Expense saved to your books.");
                navigate({ to: "/dashboard" });
              }}
            />
          </CardContent>
        </Card>

        <Card className="h-fit border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Source receipt</CardTitle>
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

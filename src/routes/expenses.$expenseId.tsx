import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/layout/AppShell";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ReceiptPreview } from "@/components/upload/ReceiptPreview";
import { useExpenses } from "@/hooks/use-expenses";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/expenses/$expenseId")({
  head: () => ({
    meta: [
      { title: "Expense details — Expense Organizer" },
      { name: "description", content: "View and edit a single tracked business expense." },
      { property: "og:title", content: "Expense details — Expense Organizer" },
      { property: "og:description", content: "View and edit a single tracked business expense." },
    ],
  }),
  component: ExpenseDetailPage,
});

function ExpenseDetailPage() {
  const { expenseId } = useParams({ from: "/expenses/$expenseId" });
  const navigate = useNavigate();
  const { expenses, update, remove } = useExpenses();
  const [missing, setMissing] = useState(false);
  const expense = expenses.find((e) => e.id === expenseId);

  useEffect(() => {
    if (expenses.length && !expense) setMissing(true);
  }, [expenses, expense]);

  if (missing) {
    return (
      <AppShell title="Expense not found" description="It may have been deleted">
        <Link to="/expenses">
          <Button variant="outline">
            <ArrowLeft className="size-4" /> Back to expenses
          </Button>
        </Link>
      </AppShell>
    );
  }

  if (!expense) return null;

  const { id, currency, createdAt, ...values } = expense;

  return (
    <AppShell
      title={expense.merchant}
      description={`${formatDate(expense.date)} · added ${formatDate(createdAt)}`}
      actions={
        <div className="flex gap-2">
          <Link to="/expenses">
            <Button variant="outline">
              <ArrowLeft className="size-4" /> Back
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              remove(id);
              toast.success("Expense deleted.");
              navigate({ to: "/expenses" });
            }}
          >
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Edit expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              initial={values}
              submitLabel="Save changes"
              onCancel={() => navigate({ to: "/expenses" })}
              onSubmit={(next) => {
                update(id, next);
                toast.success("Expense updated.");
                navigate({ to: "/expenses" });
              }}
            />
          </CardContent>
        </Card>

        <Card className="h-fit border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceiptPreview
              fileName={expense.receiptFileName}
              merchant={expense.merchant}
              date={formatDate(expense.date)}
              gstin={expense.gstin}
              invoiceNumber={expense.invoiceNumber}
              items={expense.lineItems.map((i) => ({ label: i.description, amount: i.amount }))}
              subtotal={expense.subtotal}
              tax={expense.taxAmount}
              total={expense.total}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

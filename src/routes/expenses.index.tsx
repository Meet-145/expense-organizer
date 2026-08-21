import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/layout/AppShell";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { useExpenses } from "@/hooks/use-expenses";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { exportExpensesCsv } from "@/services/export";

export const Route = createFileRoute("/expenses/")({
  head: () => ({
    meta: [
      { title: "All expenses — Expense Organizer" },
      { name: "description", content: "Search, filter and manage every tracked business expense." },
      { property: "og:title", content: "All expenses — Expense Organizer" },
      {
        property: "og:description",
        content: "Search, filter and manage every tracked business expense.",
      },
    ],
  }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const { expenses, remove } = useExpenses();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      expenses.filter((e) => {
        const matchesQ =
          !q ||
          e.merchant.toLowerCase().includes(q.toLowerCase()) ||
          (e.invoiceNumber ?? "").toLowerCase().includes(q.toLowerCase());
        const matchesCat = category === "all" || e.category === category;
        const matchesStatus = status === "all" || e.status === status;
        return matchesQ && matchesCat && matchesStatus;
      }),
    [expenses, q, category, status],
  );

  const total = filtered.reduce((s, e) => s + e.total, 0);

  return (
    <AppShell
      title="Expenses"
      description={`${filtered.length} of ${expenses.length} expenses · ${formatINR(total)}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              exportExpensesCsv(filtered);
              toast.success("CSV downloaded.");
            }}
          >
            <Download className="size-4" /> <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Link to="/upload">
            <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
              <Upload className="size-4" /> <span className="hidden sm:inline">Upload</span>
            </Button>
          </Link>
        </div>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search merchant or invoice number"
            className="bg-white pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full bg-white sm:w-52">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {EXPENSE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full bg-white sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="reimbursed">Reimbursed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ExpenseTable
        expenses={filtered}
        onDelete={(id) => {
          remove(id);
          toast.success("Expense deleted.");
        }}
      />
    </AppShell>
  );
}

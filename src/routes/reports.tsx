import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/layout/AppShell";
import { useExpenses } from "@/hooks/use-expenses";
import { formatINR, monthKey, monthLabel } from "@/lib/format";
import { exportExpensesCsv } from "@/services/export";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Expense Organizer" },
      { name: "description", content: "GST-ready monthly and category reports you can export." },
      { property: "og:title", content: "Reports — Expense Organizer" },
      {
        property: "og:description",
        content: "GST-ready monthly and category reports you can export.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { expenses } = useExpenses();
  const months = useMemo(
    () => Array.from(new Set(expenses.map((e) => monthKey(e.date)))).sort().reverse(),
    [expenses],
  );
  const [month, setMonth] = useState("all");

  const rows = useMemo(
    () => (month === "all" ? expenses : expenses.filter((e) => monthKey(e.date) === month)),
    [expenses, month],
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, { total: number; gst: number; count: number }>();
    rows.forEach((e) => {
      const cur = map.get(e.category) ?? { total: 0, gst: 0, count: 0 };
      map.set(e.category, {
        total: cur.total + e.total,
        gst: cur.gst + e.taxAmount,
        count: cur.count + 1,
      });
    });
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [rows]);

  const total = rows.reduce((s, e) => s + e.total, 0);
  const gst = rows.reduce((s, e) => s + e.taxAmount, 0);

  return (
    <AppShell
      title="Reports"
      description="Hand this to your CA at filing time"
      actions={
        <Button
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => {
            exportExpensesCsv(rows, `expense-report-${month}.csv`);
            toast.success("Report exported as CSV.");
          }}
        >
          <Download className="size-4" /> <span className="hidden sm:inline">Export report</span>
        </Button>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-full bg-white sm:w-56">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All periods</SelectItem>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {monthLabel(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-slate-500">
          {rows.length} expenses · {formatINR(total)} spend · {formatINR(gst)} GST input credit
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2 text-base text-slate-900">
            <FileBarChart className="size-4 text-brand" /> Category summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Receipts</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCategory.map(([name, v]) => (
                <TableRow key={name}>
                  <TableCell className="font-medium text-slate-900">{name}</TableCell>
                  <TableCell className="text-right">{v.count}</TableCell>
                  <TableCell className="text-right">{formatINR(v.gst)}</TableCell>
                  <TableCell className="text-right font-medium">{formatINR(v.total)}</TableCell>
                  <TableCell className="text-right text-slate-500">
                    {total ? ((v.total / total) * 100).toFixed(1) : "0.0"}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-slate-50/60">
                <TableCell className="font-semibold text-slate-900">Total</TableCell>
                <TableCell className="text-right font-semibold">{rows.length}</TableCell>
                <TableCell className="text-right font-semibold">{formatINR(gst)}</TableCell>
                <TableCell className="text-right font-semibold">{formatINR(total)}</TableCell>
                <TableCell className="text-right font-semibold">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}

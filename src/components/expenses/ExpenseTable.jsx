import { Link } from "@tanstack/react-router";
import { Eye, Trash2, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatINR } from "@/lib/format";

export function ExpenseTable({
  expenses,
  onDelete,
  compact = false,
}

 ) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-medium text-slate-900">No expenses yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Upload a receipt and the AI will fill in the details for you.
        </p>
        <Link to="/upload">
          <Button className="mt-4 bg-brand text-brand-foreground hover:bg-brand/90">
            Upload a receipt
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80">
            <TableHead className="min-w-40">Merchant</TableHead>
            <TableHead>Date</TableHead>
            {!compact && <TableHead>Category</TableHead>}
            {!compact && <TableHead>Payment</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

          {expenses.map((e) => (
            <TableRow key={e.id} className="hover:bg-slate-50/70">
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{e.merchant}</span>
                  {e.source === "ai-extraction" && (
                    <Sparkles className="size-3.5 text-brand" aria-label="AI extracted" />
                  )}
                </div>
                {compact && <p className="text-xs text-slate-500">{e.category}</p>}
              </TableCell>
              <TableCell className="whitespace-nowrap text-slate-600">{formatDate(e.date)}</TableCell>
              {!compact && <TableCell className="text-slate-600">{e.category}</TableCell>}
              {!compact && <TableCell className="text-slate-600">{e.paymentMethod}</TableCell>}
              <TableCell>
                <StatusBadge status={e.status} />
              </TableCell>
              <TableCell className="text-right font-medium whitespace-nowrap text-slate-900">
                {formatINR(e.total)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Link to="/expenses/$expenseId" params={{ expenseId: e.id }}>
                    <Button variant="ghost" size="icon" aria-label={`View ${e.merchant}`}>
                      <Eye className="size-4" />
                    </Button>
                  </Link>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${e.merchant}`}
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(e.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

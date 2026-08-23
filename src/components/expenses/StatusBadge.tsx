import { cn } from "@/lib/utils";
import type { ExpenseStatus } from "@/lib/types";

const MAP: Record<ExpenseStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-warning/15 text-warning" },
  approved: { label: "Approved", cls: "bg-positive/10 text-positive" },
  reimbursed: { label: "Reimbursed", cls: "bg-brand/10 text-brand" },
};

export function StatusBadge({ status, className }: { status: ExpenseStatus; className?: string }) {
  const { label, cls } = MAP[status];
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium", cls, className)}
    >
      {label}
    </span>
  );
}

import { cn } from "@/lib/utils";

const MAP                                                        = {
  pending: { label: "Pending", cls: "bg-warning/15 text-warning" },
  approved: { label: "Approved", cls: "bg-positive/10 text-positive" },
  reimbursed: { label: "Reimbursed", cls: "bg-brand/10 text-brand" },
};

export function StatusBadge({ status, className }                                               ) {
  const { label, cls } = MAP[status];
  return (
    <span
      className={                                                                                    }
    >
      {label}
    </span>
  );
}

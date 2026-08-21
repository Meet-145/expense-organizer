import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { formatINR, uid } from "@/lib/format";
import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  type Expense,
  type ExpenseCategory,
  type ExpenseStatus,
  type LineItem,
  type PaymentMethod,
} from "@/lib/types";

export type ExpenseFormValues = Omit<Expense, "id" | "currency" | "createdAt">;

export function ExpenseForm({
  initial,
  onSubmit,
  submitLabel = "Save expense",
  onCancel,
  busy = false,
}: {
  initial: ExpenseFormValues;
  onSubmit: (values: ExpenseFormValues) => void;
  submitLabel?: string;
  onCancel?: () => void;
  busy?: boolean;
}) {
  const [values, setValues] = useState<ExpenseFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof ExpenseFormValues>(key: K, value: ExpenseFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const itemsTotal = useMemo(
    () => values.lineItems.reduce((s, i) => s + (Number(i.amount) || 0), 0),
    [values.lineItems],
  );

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setValues((v) => ({
      ...v,
      lineItems: v.lineItems.map((i) => {
        if (i.id !== id) return i;
        const next = { ...i, ...patch };
        if (patch.quantity !== undefined || patch.unitPrice !== undefined) {
          next.amount = Number(((next.quantity || 0) * (next.unitPrice || 0)).toFixed(2));
        }
        return next;
      }),
    }));

  const recalcTotals = () => {
    const subtotal = Number(itemsTotal.toFixed(2));
    const taxAmount = Number(((subtotal * (values.taxRate || 0)) / 100).toFixed(2));
    setValues((v) => ({ ...v, subtotal, taxAmount, total: Number((subtotal + taxAmount).toFixed(2)) }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.merchant.trim()) next["merchant"] = "Merchant name is required.";
    if (!values.date) next["date"] = "Pick the receipt date.";
    if (!(values.total > 0)) next["total"] = "Total must be greater than zero.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(ev) => {
        ev.preventDefault();
        if (validate()) onSubmit(values);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Merchant" error={errors["merchant"]} confidence={values.confidence["merchant"]}>
          <Input value={values.merchant} onChange={(e) => set("merchant", e.target.value)} />
        </Field>

        <Field label="Date" error={errors["date"]} confidence={values.confidence["date"]}>
          <Input type="date" value={values.date} onChange={(e) => set("date", e.target.value)} />
        </Field>

        <Field label="Category" confidence={values.confidence["category"]}>
          <Select
            value={values.category}
            onValueChange={(v) => set("category", v as ExpenseCategory)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Payment method" confidence={values.confidence["paymentMethod"]}>
          <Select
            value={values.paymentMethod}
            onValueChange={(v) => set("paymentMethod", v as PaymentMethod)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Invoice number" confidence={values.confidence["invoiceNumber"]}>
          <Input
            value={values.invoiceNumber ?? ""}
            onChange={(e) => set("invoiceNumber", e.target.value)}
            placeholder="INV-2026-0001"
          />
        </Field>

        <Field label="GSTIN" confidence={values.confidence["gstin"]}>
          <Input
            value={values.gstin ?? ""}
            onChange={(e) => set("gstin", e.target.value)}
            placeholder="29AAECC1234F1Z2"
          />
        </Field>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Line items</p>
            <p className="text-xs text-slate-500">
              Items total {formatINR(itemsTotal)} — edit anything the AI got wrong.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={recalcTotals}>
              Recalculate totals
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                setValues((v) => ({
                  ...v,
                  lineItems: [
                    ...v.lineItems,
                    { id: uid("li"), description: "", quantity: 1, unitPrice: 0, amount: 0 },
                  ],
                }))
              }
            >
              <Plus className="size-4" /> Add item
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {values.lineItems.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
              No line items — add one if you want an itemised record.
            </p>
          )}
          {values.lineItems.map((item) => (
            <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_80px_110px_110px_40px]">
              <Input
                aria-label="Description"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
              />
              <Input
                aria-label="Quantity"
                type="number"
                min={0}
                value={item.quantity}
                onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
              />
              <Input
                aria-label="Unit price"
                type="number"
                min={0}
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
              />
              <Input
                aria-label="Amount"
                type="number"
                min={0}
                value={item.amount}
                onChange={(e) => updateItem(item.id, { amount: Number(e.target.value) })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove line item"
                className="text-destructive"
                onClick={() =>
                  setValues((v) => ({ ...v, lineItems: v.lineItems.filter((i) => i.id !== item.id) }))
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <Field label="Subtotal (₹)" confidence={values.confidence["subtotal"]}>
          <Input
            type="number"
            value={values.subtotal}
            onChange={(e) => set("subtotal", Number(e.target.value))}
          />
        </Field>
        <Field label="GST rate (%)" confidence={values.confidence["taxRate"]}>
          <Input
            type="number"
            value={values.taxRate}
            onChange={(e) => set("taxRate", Number(e.target.value))}
          />
        </Field>
        <Field label="Tax amount (₹)" confidence={values.confidence["taxAmount"]}>
          <Input
            type="number"
            value={values.taxAmount}
            onChange={(e) => set("taxAmount", Number(e.target.value))}
          />
        </Field>
        <Field label="Total (₹)" error={errors["total"]} confidence={values.confidence["total"]}>
          <Input
            type="number"
            value={values.total}
            onChange={(e) => set("total", Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Status">
          <Select value={values.status} onValueChange={(v) => set("status", v as ExpenseStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="reimbursed">Reimbursed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Notes">
          <Textarea
            rows={3}
            value={values.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Client meeting, project code, anything your accountant needs."
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={busy} className="bg-positive text-white hover:bg-positive/90">
          {busy ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  confidence,
  children,
}: {
  label: string;
  error?: string;
  confidence?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-slate-700">{label}</Label>
        <ConfidenceBadge score={confidence} />
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

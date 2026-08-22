import { FileText } from "lucide-react";
import { formatINR } from "@/lib/format";

/**
 * Renders either the uploaded image, or — for the demo receipt / PDFs — a
 * realistic thermal-printed receipt facsimile so the review screen always has
 * something meaningful to compare against.
 */
export function ReceiptPreview({
  previewUrl,
  fileName,
  merchant = "Cafe Coffee Day, MG Road",
  date = "19 Aug 2026",
  gstin = "29AAECC1234F1Z2",
  invoiceNumber = "CCD/26-27/40921",
  items = [
    { label: "Cappuccino (Regular) x2", amount: 520 },
    { label: "Veg Club Sandwich x2", amount: 480 },
    { label: "Chocolate Brownie x1", amount: 120 },
  ],
  subtotal = 1120,
  tax = 56,
  total = 1176,
}: {
  previewUrl?: string;
  fileName?: string;
  merchant?: string;
  date?: string;
  gstin?: string;
  invoiceNumber?: string;
  items?: Array<{ label: string; amount: number }>;
  subtotal?: number;
  tax?: number;
  total?: number;
}) {
  if (previewUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <img src={previewUrl} alt={fileName ?? "Uploaded receipt"} className="max-h-[520px] w-full object-contain" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
      <div className="mx-auto max-w-xs rounded-md bg-white p-5 font-mono text-[11px] leading-5 text-slate-700 shadow-md">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-slate-900">{merchant.toUpperCase()}</p>
          <p>Ground Floor, Bengaluru 560001</p>
          <p>GSTIN: {gstin}</p>
        </div>
        <div className="my-3 border-t border-dashed border-slate-300" />
        <div className="flex justify-between">
          <span>Invoice</span>
          <span>{invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span>{date}</span>
        </div>
        <div className="my-3 border-t border-dashed border-slate-300" />
        {items.map((i) => (
          <div key={i.label} className="flex justify-between gap-3">
            <span className="truncate">{i.label}</span>
            <span>{i.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="my-3 border-t border-dashed border-slate-300" />
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>CGST + SGST</span>
          <span>{tax.toFixed(2)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm font-bold text-slate-900">
          <span>TOTAL</span>
          <span>{formatINR(total)}</span>
        </div>
        <div className="my-3 border-t border-dashed border-slate-300" />
        <p className="text-center">Paid via UPI · Thank you!</p>
        <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400">
          <FileText className="size-3" /> {fileName ?? "sample-receipt.jpg"}
        </p>
      </div>
    </div>
  );
}

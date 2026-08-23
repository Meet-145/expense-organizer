

/** Client-side CSV export (demo). Future: generate server-side for large sets. */
export function exportExpensesCsv(expenses           , fileName = "expenses.csv") {
  const headers = [
    "Date",
    "Merchant",
    "Category",
    "Payment",
    "Status",
    "GSTIN",
    "Invoice",
    "Subtotal",
    "GST Rate %",
    "GST Amount",
    "Total",
  ];
  const rows = expenses.map((e) => [
    e.date,
    e.merchant,
    e.category,
    e.paymentMethod,
    e.status,
    e.gstin ?? "",
    e.invoiceNumber ?? "",
    e.subtotal,
    e.taxRate,
    e.taxAmount,
    e.total,
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

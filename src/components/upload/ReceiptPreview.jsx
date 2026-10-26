import { FileText } from "lucide-react";

/**
 * Renders the uploaded receipt image. For PDFs (which can't be shown inline
 * as an <img>), shows a neutral document placeholder with the filename
 * instead of fabricating receipt contents.
 */
export function ReceiptPreview({ previewUrl, fileName }) {
  if (previewUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <img src={previewUrl} alt={fileName ?? "Uploaded receipt"} className="max-h-[520px] w-full object-contain" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-slate-200 text-slate-500">
        <FileText className="size-7" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">{fileName ?? "Document uploaded"}</p>
        <p className="mt-1 text-xs text-slate-500">PDF preview isn't rendered inline — extraction still reads the full document.</p>
      </div>
    </div>
  );
}

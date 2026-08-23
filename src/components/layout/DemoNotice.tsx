import { Info } from "lucide-react";

export function DemoNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-slate-700">
      <Info className="mt-0.5 size-4 shrink-0 text-brand" />
      <p>
        <span className="font-medium text-slate-900">Sample workspace.</span> Figures shown are sample
        INR records stored locally in your browser, and receipt extraction runs against a simulated
        model. In a live deployment, extraction is handled by a secure server endpoint so credentials
        are never exposed to the browser.
      </p>

    </div>
  );
}

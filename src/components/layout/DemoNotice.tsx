import { Info } from "lucide-react";

export function DemoNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-slate-700">
      <Info className="mt-0.5 size-4 shrink-0 text-brand" />
      <p>
        <span className="font-medium text-slate-900">Demo mode.</span> Data is mock INR data stored
        in your browser and receipt extraction is simulated. In production the app calls a secure{" "}
        <code className="rounded bg-white px-1 py-0.5 text-xs">/api/extract-receipt</code> endpoint
        backed by Gemini — the API key never reaches the browser.
      </p>
    </div>
  );
}

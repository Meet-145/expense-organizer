import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Expense Organizer" },
      {
        name: "description",
        content: "Simple INR pricing for Indian small businesses. Start free, upgrade when you scale.",
      },
      { property: "og:title", content: "Pricing — Expense Organizer" },
      {
        property: "og:description",
        content: "Simple INR pricing for Indian small businesses. Start free, upgrade when you scale.",
      },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Starter",
    price: "₹0",
    note: "forever",
    features: ["25 receipts / month", "AI extraction", "CSV export", "1 user"],
  },
  {
    name: "Growth",
    price: "₹1,499",
    note: "per month",
    featured: true,
    features: [
      "500 receipts / month",
      "GST-ready reports",
      "Analytics dashboard",
      "5 users",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: "₹3,999",
    note: "per month",
    features: ["Unlimited receipts", "Approval workflows", "Accountant access", "Unlimited users"],
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <MarketingHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-center text-4xl font-semibold text-slate-900">
          Pricing that fits a small business
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          Prototype only — no payment is ever taken. Choosing a plan just switches your demo
          workspace label.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "rounded-2xl border bg-white p-7 shadow-sm",
                p.featured ? "border-brand ring-2 ring-brand/20" : "border-slate-200",
              )}
            >
              {p.featured && (
                <span className="mb-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-lg font-semibold text-slate-900">{p.name}</h2>
              <p className="mt-3">
                <span className="font-display text-3xl font-semibold text-slate-900">{p.price}</span>{" "}
                <span className="text-sm text-slate-500">{p.note}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-positive" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "mt-7 w-full",
                  p.featured
                    ? "bg-brand text-brand-foreground hover:bg-brand/90"
                    : "bg-slate-900 text-white hover:bg-slate-800",
                )}
                onClick={() => toast.info(`${p.name} selected — billing is disabled in this demo.`)}
              >
                Choose {p.name}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Want to poke around first?{" "}
          <Link to="/dashboard" className="font-medium text-brand hover:underline">
            Open the demo dashboard
          </Link>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}

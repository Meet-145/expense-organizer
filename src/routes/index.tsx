import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ScanLine,
  ShieldCheck,
  Sparkles,
  FileBarChart,
  Wallet,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { ReceiptPreview } from "@/components/upload/ReceiptPreview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Expense Organizer — AI receipt tracking for Indian small businesses" },
      {
        name: "description",
        content:
          "Upload a receipt, get merchant, GST and line items extracted automatically, and export GST-ready expense reports in INR.",
      },
      { property: "og:title", content: "Expense Organizer — AI receipt tracking" },
      {
        property: "og:description",
        content: "Receipts in, GST-ready expense reports out. Built for small business owners in India.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: ScanLine,
    title: "AI receipt extraction",
    body: "Merchant, date, GSTIN, line items and tax split are read from a photo in seconds — with a confidence score on every field.",
  },
  {
    icon: FileBarChart,
    title: "GST-ready reports",
    body: "Month-wise input tax credit summaries and category breakdowns your CA can actually work with. Export to CSV in a click.",
  },
  {
    icon: Wallet,
    title: "Cash-flow clarity",
    body: "See what you spent, where, and how it's trending — before your quarterly numbers surprise you.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-navy-deep">
      <MarketingHeader />

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <Sparkles className="size-3.5 text-positive" /> Demo prototype · Indian SMBs · FY 2026-27
            </span>
            <h1 className="font-display mt-5 text-4xl leading-tight font-semibold text-white sm:text-5xl">
              Receipts in.{" "}
              <span className="text-positive">GST-ready books</span> out.
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-300">
              Expense Organizer reads every receipt for you — merchant, GSTIN, line items, tax split —
              so a small business owner spends minutes a month on expenses, not evenings.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="w-full bg-positive text-white hover:bg-positive/90 sm:w-auto">
                  Start free <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                >
                  Try the demo receipt
                </Button>
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                ["₹4.2L", "tracked in demo data"],
                ["12 sec", "average per receipt"],
                ["96%", "field-level accuracy"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-xl font-semibold text-white">{v}</dt>
                  <dd className="mt-1 text-xs text-slate-400">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-brand/20 blur-3xl" aria-hidden />
            <div className="relative rounded-2xl border border-white/10 bg-white p-4 shadow-2xl">
              <ReceiptPreview />
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-positive/10 px-3 py-2 text-xs text-positive">
                <ShieldCheck className="size-4" /> Extracted with 97% confidence · ₹1,176.00 · Meals &
                Entertainment
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Everything a small business needs, nothing it doesn't
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-display mt-4 text-base font-semibold text-slate-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid gap-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-4">
            {[
              ["1. Upload", "Drag a photo or PDF of any receipt."],
              ["2. Extract", "AI reads and structures every field."],
              ["3. Review", "Fix anything flagged low confidence."],
              ["4. Report", "Dashboards and GST exports update instantly."],
            ].map(([t, b]) => (
              <div key={t}>
                <p className="font-display text-sm font-semibold text-brand">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">
              Close your books before your chai gets cold
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <Clock className="size-4 text-positive" /> Sign in with any email and password — it's a demo.
            </p>
          </div>
          <div className="md:ml-auto">
            <Link to="/login">
              <Button size="lg" className="bg-positive text-white hover:bg-positive/90">
                Open the demo dashboard <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

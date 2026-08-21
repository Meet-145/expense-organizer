import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy-deep py-10 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="font-display text-sm font-semibold text-white">Expense Organizer</span>
        </div>
        <p className="text-xs md:ml-4">
          Built for Indian small businesses. GST-ready reports, INR-first. Prototype — demo data only.
        </p>
        <nav className="flex gap-4 text-xs md:ml-auto">
          <Link to="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link to="/login" className="hover:text-white">
            Log in
          </Link>
          <Link to="/signup" className="hover:text-white">
            Sign up
          </Link>
        </nav>
      </div>
    </footer>
  );
}

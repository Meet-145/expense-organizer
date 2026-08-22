import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function MarketingHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-deep/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <Logo className="h-10 bg-white p-1 sm:h-11" />
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-slate-300 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-positive text-white hover:bg-positive/90">Go to dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-200 hover:bg-white/10 hover:text-white">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-positive text-white hover:bg-positive/90">Start free</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle menu"
          className="ml-auto text-slate-200 hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open && (
        <div className="space-y-2 border-t border-white/10 px-4 py-4 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10">
                Log in
              </Button>
            </Link>
            <Link to="/signup" className="flex-1" onClick={() => setOpen(false)}>
              <Button className="w-full bg-positive text-white hover:bg-positive/90">Start free</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

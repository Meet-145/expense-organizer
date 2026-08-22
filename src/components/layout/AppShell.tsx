import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Upload,
  ReceiptText,
  FileBarChart,
  PieChart,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  CreditCard,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRequireAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth";
import { DemoNotice } from "./DemoNotice";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Receipt", icon: Upload },
  { to: "/expenses", label: "Expenses", icon: ReceiptText },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/analytics", label: "Analytics", icon: PieChart },
  { to: "/pricing", label: "Plans & Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, ready } = useRequireAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-muted-foreground">
        Loading your workspace…
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-deep text-slate-200">
      <div className="flex items-center gap-2 px-5 py-5">
        <Logo className="h-11 min-w-0 flex-1 bg-white p-1" />
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl bg-white/5 p-4">
        <p className="text-xs font-medium text-white">{user.plan} plan</p>
        <p className="mt-1 text-[11px] text-slate-400">
          42 of 250 receipts used this month.
        </p>
        <Link to="/pricing" onClick={() => setOpen(false)}>
          <Button size="sm" className="mt-3 w-full bg-positive text-white hover:bg-positive/90">
            Upgrade
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4">
        <Avatar className="size-9">
          <AvatarFallback className="bg-navy-soft text-xs text-white">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="truncate text-[11px] text-slate-400">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sign out"
          className="text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={() => {
            authService.signOut();
            navigate({ to: "/", replace: true });
          }}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="font-display truncate text-lg font-semibold text-slate-900 sm:text-xl">
                {title}
              </h1>
              {description && (
                <p className="truncate text-xs text-slate-500 sm:text-sm">{description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          </div>
        </header>

        <main className="space-y-6 p-4 sm:p-6">
          <DemoNotice />
          {children}
        </main>
      </div>
    </div>
  );
}

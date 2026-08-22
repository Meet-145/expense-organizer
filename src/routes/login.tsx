import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Expense Organizer" },
      { name: "description", content: "Sign in to your Expense Organizer demo workspace." },
      { property: "og:title", content: "Log in — Expense Organizer" },
      { property: "og:description", content: "Sign in to your Expense Organizer demo workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("owner@brightleaf.in");
  const [password, setPassword] = useState("demo1234");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your expense workspace. Any valid email and a 6+ character password works in demo mode."
    >
      <form
        className="space-y-4"
        onSubmit={async (ev) => {
          ev.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await authService.signIn(email, password);
            toast.success("Signed in — welcome back!");
            navigate({ to: "/dashboard" });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={busy}
          className="w-full bg-positive text-white hover:bg-positive/90"
        >
          {busy && <Loader2 className="size-4 animate-spin" />} Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link to="/signup" className="font-medium text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-navy-deep p-10 lg:flex">
        <Link to="/" className="flex items-center">
          <Logo className="h-12 bg-white p-1" />
        </Link>
        <div>
          <h2 className="font-display text-3xl leading-snug font-semibold text-white">
            “I stopped keeping receipts in a shoebox. Now my CA gets a clean GST sheet every month.”
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Meera Iyer · Founder, Brightleaf Traders, Bengaluru
          </p>
        </div>
        <p className="text-xs text-slate-500">
          Demo prototype · no real accounts, no real payments, data stays in your browser.
        </p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link to="/" className="mb-6 flex items-center lg:hidden">
            <Logo className="h-10" />
          </Link>
          <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 mb-6 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

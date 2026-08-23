import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — Expense Organizer" },
      {
        name: "description",
        content: "Set up a free Expense Organizer workspace for your small business.",
      },
      { property: "og:title", content: "Create your account — Expense Organizer" },
      {
        property: "og:description",
        content: "Set up a free Expense Organizer workspace for your small business.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState               (null);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const set = (k                   ) => (e                                     ) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start with 25 free receipts a month. No card needed."
    >
      <form
        className="space-y-4"
        onSubmit={async (ev) => {
          ev.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await authService.signUp(form);
            toast.success("Workspace created — here's your dashboard.");
            navigate({ to: "/dashboard" });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" value={form.name} onChange={           } placeholder="Meera Iyer" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Business name</Label>
          <Input
            id="company"
            value={form.company}
            onChange={              }
            placeholder="Brightleaf Traders Pvt Ltd"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={            }
            placeholder="you@business.in"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={               }
            placeholder="At least 6 characters"
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
          {busy && <Loader2 className="size-4 animate-spin" />} Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

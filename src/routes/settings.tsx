import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth";
import { useExpenses } from "@/hooks/use-expenses";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Expense Organizer" },
      { name: "description", content: "Manage your profile, business details and demo data." },
      { property: "og:title", content: "Settings — Expense Organizer" },
      { property: "og:description", content: "Manage your profile, business details and demo data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { reset } = useExpenses();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    company: user?.company ?? "",
    gstin: "29AAECB4567L1Z9",
  });

  return (
    <AppShell title="Settings" description="Profile, business and demo data">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Profile & business</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(
              [
                ["name", "Your name"],
                ["email", "Email"],
                ["company", "Business name"],
                ["gstin", "GSTIN"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <Button
              className="bg-positive text-white hover:bg-positive/90"
              onClick={() => {
                if (user) {
                  authService.persist({
                    ...user,
                    name: form.name,
                    email: form.email,
                    company: form.company,
                  });
                }
                toast.success("Settings saved.");
              }}
            >
              <Save className="size-4" /> Save changes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Demo data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              This prototype stores everything in your browser. Resetting restores the original
              sample expenses and discards anything you added.
            </p>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                reset();
                toast.success("Demo data restored.");
              }}
            >
              <RotateCcw className="size-4" /> Reset demo data
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

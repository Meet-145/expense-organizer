import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IndianRupee, Receipt, Percent, Clock, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/expenses/StatCard";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { useExpenses, useExpenseStats } from "@/hooks/use-expenses";
import { formatINR, monthLabel } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Expense Organizer" },
      {
        name: "description",
        content: "Track spend, GST credit and recent receipts across your business at a glance.",
      },
      { property: "og:title", content: "Dashboard — Expense Organizer" },
      {
        property: "og:description",
        content: "Track spend, GST credit and recent receipts across your business at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

const PIE_COLORS = ["#2f6fed", "#22a06b", "#f0a92e", "#7a5af8", "#e2574c", "#0ea5b7", "#8b5cf6", "#64748b", "#94a3b8"];

function DashboardPage() {
  const { expenses } = useExpenses();
  const stats = useExpenseStats(expenses);

  const trend = stats.byMonth.map((m) => ({ ...m, label: monthLabel(m.key) }));

  return (
    <AppShell
      title="Dashboard"
      description="Your business spend for FY 2026-27"
      actions={
        <Link to="/upload">
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Upload className="size-4" /> <span className="hidden sm:inline">Upload receipt</span>
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Spend this month"
          value={formatINR(stats.monthTotal)}
          icon={IndianRupee}
          change={stats.change}
          hint="vs last month"
        />
        <StatCard
          label="Total tracked"
          value={formatINR(stats.total)}
          icon={Receipt}
          hint={`${stats.count} receipts`}
          positiveIsDown={false}
        />
        <StatCard
          label="GST input credit"
          value={formatINR(stats.gst)}
          icon={Percent}
          hint="claimable this year"
          positiveIsDown={false}
        />
        <StatCard
          label="Pending review"
          value={formatINR(stats.pendingAmount)}
          icon={Clock}
          hint={`${stats.pendingCount} expenses`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Spend trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -12, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f6fed" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2f6fed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
                <YAxis
                  tickFormatter={(v) => formatINR(Number(v), { compact: true })}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="#64748b"
                />
                <Tooltip formatter={(v) => formatINR(Number(v))} />
                <Area type="monotone" dataKey="total" stroke="#2f6fed" fill="url(#spend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">By category</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.byCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {stats.byCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatINR(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-base text-slate-900">GST paid per month</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ left: -12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
              <YAxis
                tickFormatter={(v) => formatINR(Number(v), { compact: true })}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#64748b"
              />
              <Tooltip formatter={(v) => formatINR(Number(v))} />
              <Bar dataKey="gst" fill="#22a06b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-slate-900">Recent expenses</h2>
          <Link to="/expenses" className="text-sm font-medium text-brand hover:underline">
            View all <ArrowRight className="inline size-3.5" />
          </Link>
        </div>
        <ExpenseTable expenses={expenses.slice(0, 6)} compact />
      </div>
    </AppShell>
  );
}

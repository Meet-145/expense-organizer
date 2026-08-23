import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/layout/AppShell";
import { useExpenses, useExpenseStats } from "@/hooks/use-expenses";
import { formatINR, monthLabel } from "@/lib/format";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Expense Organizer" },
      { name: "description", content: "Understand where your business money actually goes." },
      { property: "og:title", content: "Analytics — Expense Organizer" },
      { property: "og:description", content: "Understand where your business money actually goes." },
    ],
  }),
  component: AnalyticsPage,
});

const COLORS = ["#2f6fed", "#22a06b", "#f0a92e", "#7a5af8", "#e2574c", "#0ea5b7"];

function AnalyticsPage() {
  const { expenses } = useExpenses();
  const stats = useExpenseStats(expenses);
  const trend = stats.byMonth.map((m) => ({ ...m, label: monthLabel(m.key) }));
  const topMerchants = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.merchant] = (acc[e.merchant] ?? 0) + e.total;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <AppShell title="Analytics" description="Trends, merchants and payment mix">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Monthly spend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ left: -12, right: 8 }}>
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
                <Line type="monotone" dataKey="total" stroke="#2f6fed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Top merchants</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMerchants} layout="vertical" margin={{ left: 40, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatINR(Number(v), { compact: true })}
                  fontSize={12}
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  fontSize={11}
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip formatter={(v) => formatINR(Number(v))} />
                <Bar dataKey="value" fill="#2f6fed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Payment mix</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.byPayment} dataKey="value" nameKey="name" outerRadius={95} label>
                  {stats.byPayment.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatINR(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base text-slate-900">Key numbers</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <Metric label="Average receipt" value={formatINR(stats.avg)} />
            <Metric label="Receipts tracked" value={String(stats.count)} />
            <Metric label="GST input credit" value={formatINR(stats.gst)} />
            <Metric label="Pending review" value={String(stats.pendingCount)} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-slate-500">{label}</p>
      <p className="font-display mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

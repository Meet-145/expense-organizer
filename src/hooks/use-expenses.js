import { useCallback, useEffect, useMemo, useState } from "react";
import { expenseStore } from "@/services/expense-store";

import { monthKey } from "@/lib/format";

export function useExpenses() {
  const [expenses, setExpenses] = useState           ([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setExpenses(expenseStore.list());
    sync();
    setReady(true);
    return expenseStore.subscribe(sync);
  }, []);

  const create = useCallback((e         ) => expenseStore.create(e), []);
  const update = useCallback((id        , patch                  ) => expenseStore.update(id, patch), []);
  const remove = useCallback((id        ) => expenseStore.remove(id), []);
  const reset = useCallback(() => expenseStore.reset(), []);

  return { expenses, ready, create, update, remove, reset };
}

export function useExpenseStats(expenses           ) {
  return useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const total = expenses.reduce((s, e) => s + e.total, 0);
    const monthTotal = expenses.filter((e) => monthKey(e.date) === thisMonth).reduce((s, e) => s + e.total, 0);
    const prevTotal = expenses.filter((e) => monthKey(e.date) === prevMonth).reduce((s, e) => s + e.total, 0);
    const gst = expenses.reduce((s, e) => s + e.taxAmount, 0);
    const pending = expenses.filter((e) => e.status === "pending");

    const byCategory = Object.entries(
      expenses.reduce                        ((acc, e) => {
        acc[e.category] = (acc[e.category] ?? 0) + e.total;
        return acc;
      }, {}),
    )
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);

    const byMonthMap = expenses.reduce                                                ((acc, e) => {
      const k = monthKey(e.date);
      acc[k] = acc[k] ?? { total: 0, gst: 0 };
      acc[k].total += e.total;
      acc[k].gst += e.taxAmount;
      return acc;
    }, {});
    const byMonth = Object.entries(byMonthMap)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, v]) => ({ key, total: Number(v.total.toFixed(2)), gst: Number(v.gst.toFixed(2)) }));

    const byPayment = Object.entries(
      expenses.reduce                        ((acc, e) => {
        acc[e.paymentMethod] = (acc[e.paymentMethod] ?? 0) + e.total;
        return acc;
      }, {}),
    ).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));

    const change = prevTotal ? ((monthTotal - prevTotal) / prevTotal) * 100 : 0;

    return {
      total,
      monthTotal,
      prevTotal,
      change,
      gst,
      count: expenses.length,
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, e) => s + e.total, 0),
      avg: expenses.length ? total / expenses.length : 0,
      byCategory,
      byMonth,
      byPayment,
    };
  }, [expenses]);
}

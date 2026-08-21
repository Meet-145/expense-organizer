import type { Expense } from "@/lib/types";
import { seedExpenses } from "./demo-data";

/**
 * Demo persistence layer.
 *
 * Everything is kept in localStorage so the prototype behaves like a real app
 * (create / read / update / delete survive reloads) without a backend.
 * Swap the body of these functions for Supabase queries later — the signatures
 * are intentionally async-friendly and table-shaped. See ARCHITECTURE.md.
 */
const KEY = "eo.expenses.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function read(): Expense[] {
  if (!isBrowser()) return seedExpenses;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(seedExpenses));
      return seedExpenses;
    }
    return JSON.parse(raw) as Expense[];
  } catch {
    return seedExpenses;
  }
}

function write(list: Expense[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("eo:expenses-changed"));
}

export const expenseStore = {
  list(): Expense[] {
    return [...read()].sort((a, b) => (a.date < b.date ? 1 : -1));
  },
  get(id: string): Expense | undefined {
    return read().find((e) => e.id === id);
  },
  create(expense: Expense) {
    write([expense, ...read()]);
    return expense;
  },
  update(id: string, patch: Partial<Expense>) {
    const next = read().map((e) => (e.id === id ? { ...e, ...patch } : e));
    write(next);
    return next.find((e) => e.id === id);
  },
  remove(id: string) {
    write(read().filter((e) => e.id !== id));
  },
  reset() {
    write(seedExpenses);
  },
  subscribe(cb: () => void) {
    if (!isBrowser()) return () => {};
    window.addEventListener("eo:expenses-changed", cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener("eo:expenses-changed", cb);
      window.removeEventListener("storage", cb);
    };
  },
};

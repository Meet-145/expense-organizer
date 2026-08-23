export type ExpenseCategory =
  | "Travel"
  | "Meals & Entertainment"
  | "Office Supplies"
  | "Software & SaaS"
  | "Utilities"
  | "Marketing"
  | "Professional Services"
  | "Fuel"
  | "Other";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Travel",
  "Meals & Entertainment",
  "Office Supplies",
  "Software & SaaS",
  "Utilities",
  "Marketing",
  "Professional Services",
  "Fuel",
  "Other",
];

export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Net Banking";

export const PAYMENT_METHODS: PaymentMethod[] = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Cash",
  "Net Banking",
];

export type ExpenseStatus = "pending" | "approved" | "reimbursed";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Expense {
  id: string;
  merchant: string;
  /** ISO date (yyyy-mm-dd) */
  date: string;
  subtotal: number;
  taxAmount: number;
  /** GST rate in percent, e.g. 18 */
  taxRate: number;
  total: number;
  currency: "INR";
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  notes?: string;
  gstin?: string;
  invoiceNumber?: string;
  lineItems: LineItem[];
  /** 0..1 per-field confidence from the extraction service */
  confidence: Record<string, number>;
  source: "manual" | "ai-extraction";
  receiptFileName?: string;
  createdAt: string;
}

export interface ExtractionResult {
  merchant: string;
  date: string;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  gstin?: string;
  invoiceNumber?: string;
  lineItems: LineItem[];
  confidence: Record<string, number>;
  rawText: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: "Starter" | "Growth" | "Scale";
}

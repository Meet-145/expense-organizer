import type { ExtractionResult, LineItem } from "@/lib/types";
import { uid } from "@/lib/format";

/**
 * Structured receipt extraction service.
 *
 * DEMO MODE (current): returns a deterministic-ish mock extraction after a
 * simulated multi-stage pipeline so the UI can be exercised end to end.
 *
 * PRODUCTION (future): flip `USE_REMOTE` to true. The browser then POSTs the
 * file to `/api/extract-receipt`, a server route that holds GEMINI_API_KEY
 * (stored as a server-side secret) and calls Gemini's vision model with a JSON
 * schema. The key is NEVER shipped to the client — the browser only ever sees
 * the parsed JSON result. See ARCHITECTURE.md for the endpoint contract.
 */
const USE_REMOTE = false;

export type ProcessingStage =
  | "uploading"
  | "ocr"
  | "understanding"
  | "structuring"
  | "validating"
  | "done";

export const STAGE_LABELS: Record<ProcessingStage, string> = {
  uploading: "Uploading receipt securely",
  ocr: "Reading text from the image (OCR)",
  understanding: "Understanding merchant, date & totals",
  structuring: "Structuring line items and GST",
  validating: "Validating amounts and confidence",
  done: "Extraction complete",
};

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported file type. Upload a JPG, PNG, WEBP or PDF receipt.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "That file is larger than 10 MB. Try a compressed photo of the receipt.";
  }
  if (file.size < 1024) {
    return "That file looks empty or corrupted. Please pick another receipt.";
  }
  return null;
}

const MOCKS: Array<Omit<ExtractionResult, "lineItems"> & { items: Array<[string, number, number]> }> = [
  {
    merchant: "Cafe Coffee Day, MG Road",
    date: "2026-08-19",
    subtotal: 1120,
    taxRate: 5,
    taxAmount: 56,
    total: 1176,
    category: "Meals & Entertainment",
    paymentMethod: "UPI",
    gstin: "29AAECC1234F1Z2",
    invoiceNumber: "CCD/26-27/40921",
    confidence: {
      merchant: 0.97,
      date: 0.95,
      total: 0.98,
      taxAmount: 0.86,
      category: 0.79,
      lineItems: 0.72,
    },
    rawText: "CAFE COFFEE DAY\nMG ROAD, BENGALURU\nGSTIN 29AAECC1234F1Z2\n...",
    items: [
      ["Cappuccino (Regular)", 2, 260],
      ["Veg Club Sandwich", 2, 240],
      ["Chocolate Brownie", 1, 120],
    ],
  },
  {
    merchant: "Croma Electronics",
    date: "2026-08-17",
    subtotal: 24500,
    taxRate: 18,
    taxAmount: 4410,
    total: 28910,
    category: "Office Supplies",
    paymentMethod: "Credit Card",
    gstin: "27AAACI1195H1ZK",
    invoiceNumber: "CRM-BLR-2026-77341",
    confidence: {
      merchant: 0.99,
      date: 0.93,
      total: 0.96,
      taxAmount: 0.91,
      category: 0.68,
      lineItems: 0.83,
    },
    rawText: "CROMA A TATA ENTERPRISE\nTAX INVOICE\n...",
    items: [
      ["Logitech MX Keys S Keyboard", 1, 10500],
      ["Dell 24in Monitor P2425", 1, 14000],
    ],
  },
  {
    merchant: "Indian Oil — Whitefield",
    date: "2026-08-15",
    subtotal: 4000,
    taxRate: 0,
    taxAmount: 0,
    total: 4000,
    category: "Fuel",
    paymentMethod: "Debit Card",
    invoiceNumber: "IOCL/8821/2026",
    confidence: {
      merchant: 0.9,
      date: 0.88,
      total: 0.94,
      taxAmount: 0.55,
      category: 0.85,
      lineItems: 0.61,
    },
    rawText: "INDIAN OIL\nPETROL 38.4 L @ 104.17\n...",
    items: [["Petrol (38.4 L @ ₹104.17)", 1, 4000]],
  },
];

function buildItems(items: Array<[string, number, number]>): LineItem[] {
  return items.map(([description, quantity, amount]) => ({
    id: uid("li"),
    description,
    quantity,
    unitPrice: Number((amount / quantity).toFixed(2)),
    amount,
  }));
}

export interface ExtractOptions {
  onStage?: (stage: ProcessingStage, progress: number) => void;
  signal?: AbortSignal;
  /** Force a failure once, to exercise the retry UI. */
  simulateFailure?: boolean;
}

export async function extractReceipt(
  file: File | null,
  options: ExtractOptions = {},
): Promise<ExtractionResult> {
  const stages: ProcessingStage[] = ["uploading", "ocr", "understanding", "structuring", "validating"];

  for (let i = 0; i < stages.length; i++) {
    if (options.signal?.aborted) throw new Error("Processing cancelled.");
    options.onStage?.(stages[i]!, Math.round(((i + 1) / (stages.length + 1)) * 100));
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
  }

  if (options.simulateFailure) {
    throw new Error("We couldn't read that receipt clearly. Try a brighter, flatter photo.");
  }

  if (USE_REMOTE && file) {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/extract-receipt", { method: "POST", body });
    if (!res.ok) throw new Error("The extraction service is busy right now. Please retry.");
    const json = (await res.json()) as ExtractionResult;
    options.onStage?.("done", 100);
    return json;
  }

  const seedIndex = file ? file.name.length % MOCKS.length : 0;
  const mock = MOCKS[seedIndex]!;
  options.onStage?.("done", 100);
  const { items, ...rest } = mock;
  return { ...rest, lineItems: buildItems(items) };
}

export function confidenceLevel(score: number): "high" | "medium" | "low" {
  if (score >= 0.9) return "high";
  if (score >= 0.7) return "medium";
  return "low";
}

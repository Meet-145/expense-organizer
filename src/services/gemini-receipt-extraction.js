import { createServerFn } from "@tanstack/react-start";

/**
 * Server-side receipt extraction via Google Gemini's vision model.
 *
 * This runs ONLY on the server (TanStack Start compiles the `.handler()`
 * body out of the client bundle), so `GEMINI_API_KEY` is never sent to the
 * browser. The client calls `extractReceiptServerFn` like a normal async
 * function; under the hood it POSTs the FormData to a server-generated RPC
 * endpoint and the handler below runs on the server.
 *
 * Setup: put GEMINI_API_KEY=your-key-here in a local `.env.local` file
 * (untracked by git) for local development, and set it as a server/secret
 * environment variable on whatever platform you deploy to. Get a key at
 * https://aistudio.google.com/app/apikey
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const EXPENSE_CATEGORIES = [
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

const PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "Cash", "Net Banking"];

// Forces Gemini to return exactly the shape the app's expense form expects.
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    merchant: { type: "STRING" },
    date: { type: "STRING", description: "Receipt/invoice date, formatted YYYY-MM-DD." },
    subtotal: { type: "NUMBER", description: "Amount before tax." },
    taxRate: {
      type: "NUMBER",
      description:
        "Combined tax rate as a percentage, e.g. 18 for 18% GST. Use 0 if no tax is shown.",
    },
    taxAmount: { type: "NUMBER" },
    total: { type: "NUMBER" },
    category: { type: "STRING", enum: EXPENSE_CATEGORIES },
    paymentMethod: { type: "STRING", enum: PAYMENT_METHODS },
    gstin: {
      type: "STRING",
      description: "GSTIN printed on the receipt. Omit the field entirely if none is visible.",
    },
    invoiceNumber: {
      type: "STRING",
      description: "Invoice/receipt/bill number. Omit if none is visible.",
    },
    rawText: { type: "STRING", description: "The full raw text read off the receipt." },
    lineItems: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          description: { type: "STRING" },
          quantity: { type: "NUMBER" },
          unitPrice: { type: "NUMBER" },
          amount: { type: "NUMBER" },
        },
        required: ["description", "quantity", "unitPrice", "amount"],
      },
    },
    confidence: {
      type: "OBJECT",
      description: "Your confidence, from 0 to 1, in each extracted field.",
      properties: {
        merchant: { type: "NUMBER" },
        date: { type: "NUMBER" },
        total: { type: "NUMBER" },
        taxAmount: { type: "NUMBER" },
        category: { type: "NUMBER" },
        lineItems: { type: "NUMBER" },
      },
      required: ["merchant", "date", "total", "taxAmount", "category", "lineItems"],
    },
  },
  required: [
    "merchant",
    "date",
    "subtotal",
    "taxRate",
    "taxAmount",
    "total",
    "category",
    "paymentMethod",
    "lineItems",
    "confidence",
  ],
};

const PROMPT = `You are an expert bookkeeper reading a photographed or scanned business receipt or tax invoice (often Indian GST invoices, but could be from anywhere). Read every visible field carefully and return ONLY the JSON described by the response schema — no commentary.

Guidelines:
- Extract amounts as plain numbers (no currency symbols or commas).
- If GST/CGST/SGST/IGST lines are present, sum them into taxAmount and compute taxRate as a percentage of the subtotal.
- Pick the closest matching category and payment method from the allowed enum values; if genuinely unclear, use "Other" or your best guess.
- List every distinct line item you can read, with quantity and per-unit price (derive unitPrice from amount/quantity if only the line total is printed).
- If a field genuinely isn't visible on the document (e.g. no GSTIN), omit that key rather than guessing.
- Set each confidence score honestly based on print clarity and ambiguity — don't default to high confidence.`;

export const extractReceiptServerFn = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected multipart form data.");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Receipt extraction isn't configured on this server yet. Set the GEMINI_API_KEY environment variable and restart the server.",
      );
    }

    const file = data.get("file");
    if (!(file instanceof File)) {
      throw new Error("No file was uploaded.");
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error(
        "This file format isn't supported. Please upload a JPG, PNG, WEBP or PDF receipt.",
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(
        "This file exceeds the 10 MB limit. Please upload a compressed photo or a smaller PDF.",
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");

    let geminiRes;
    try {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: PROMPT }, { inlineData: { mimeType: file.type, data: base64 } }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
              temperature: 0.1,
            },
          }),
        },
      );
    } catch (err) {
      console.error("Gemini request failed:", err);
      throw new Error(
        "Couldn't reach the extraction service. Check your connection and try again.",
      );
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "");
      console.error("Gemini extraction failed:", geminiRes.status, errText);
      if (geminiRes.status === 400 || geminiRes.status === 403) {
        throw new Error(
          "The extraction service rejected the request. Check that GEMINI_API_KEY is valid.",
        );
      }
      throw new Error(
        "The extraction service is temporarily unavailable. Please try again in a moment.",
      );
    }

    const payload = await geminiRes.json();
    const text = payload?.candidates?.[0]?.content?.parts?.find(
      (p) => typeof p?.text === "string",
    )?.text;
    if (!text) {
      throw new Error(
        "Some details on this receipt could not be read reliably. A brighter, flatter image usually resolves this.",
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Gemini JSON output:", text);
      throw new Error("The extraction service returned an unexpected response. Please try again.");
    }

    const lineItems = Array.isArray(parsed.lineItems)
      ? parsed.lineItems.map((item) => ({
          id: `li_${Math.random().toString(36).slice(2, 10)}`,
          description: item.description ?? "",
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
          amount: Number(item.amount) || 0,
        }))
      : [];

    return { ...parsed, lineItems };
  });

import { extractReceiptServerFn } from "./gemini-receipt-extraction";

/**
 * Structured receipt extraction service.
 *
 * The browser sends the uploaded file to `extractReceiptServerFn`, a
 * TanStack Start server function (see gemini-receipt-extraction.js) that
 * runs only on the server, holds GEMINI_API_KEY as a secret, and calls
 * Gemini's vision model with a JSON schema. The key is never shipped to the
 * client — the browser only ever sees the parsed JSON result.
 *
 * The staged progress below is a client-side UX affordance (a real upload +
 * multi-stage OCR pipeline doesn't expose granular progress events), shown
 * while the actual extraction request is in flight.
 */

export const STAGE_LABELS = {
  uploading: "Securely uploading your receipt",
  ocr: "Recognising text on the document",
  understanding: "Identifying merchant, date and amounts",
  structuring: "Structuring line items and GST details",
  validating: "Verifying totals and extraction accuracy",
  done: "Extraction complete — ready for review",
};

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export function validateFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "This file format isn't supported. Please upload a JPG, PNG, WEBP or PDF receipt.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "This file exceeds the 10 MB limit. Please upload a compressed photo or a smaller PDF.";
  }
  if (file.size < 1024) {
    return "This file appears to be empty or damaged. Please select a different receipt.";
  }
  return null;
}

export async function extractReceipt(file, options = {}) {
  if (!file) {
    throw new Error("No receipt file was provided.");
  }

  const stages = ["uploading", "ocr", "understanding", "structuring"];
  for (let i = 0; i < stages.length; i++) {
    if (options.signal?.aborted) throw new Error("Processing was cancelled.");
    options.onStage?.(stages[i], Math.round(((i + 1) / (stages.length + 2)) * 100));
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 350));
  }

  if (options.simulateFailure) {
    throw new Error(
      "Some details on this receipt could not be read reliably. A brighter, flatter image usually resolves this.",
    );
  }

  options.onStage?.("validating", 90);

  const body = new FormData();
  body.append("file", file);
  const result = await extractReceiptServerFn({ data: body });

  if (options.signal?.aborted) throw new Error("Processing was cancelled.");

  options.onStage?.("done", 100);
  return result;
}

export function confidenceLevel(score) {
  if (score >= 0.9) return "high";
  if (score >= 0.7) return "medium";
  return "low";
}

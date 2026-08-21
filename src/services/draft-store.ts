import type { ExtractionResult } from "@/lib/types";

/**
 * In-memory hand-off between Upload → Processing → Review.
 * File/object-URL data can't be serialized to localStorage, so the draft lives
 * for the lifetime of the tab. (Future: upload to storage, keep only the URL.)
 */
export interface ReceiptDraft {
  fileName: string;
  fileSize: number;
  previewUrl?: string;
  isDemo: boolean;
  file?: File;
  extraction?: ExtractionResult;
}

let draft: ReceiptDraft | null = null;

export const draftStore = {
  set(next: ReceiptDraft) {
    draft = next;
  },
  patch(patch: Partial<ReceiptDraft>) {
    if (draft) draft = { ...draft, ...patch };
  },
  get() {
    return draft;
  },
  clear() {
    draft = null;
  },
};



/**
 * In-memory hand-off between Upload → Processing → Review.
 * File/object-URL data can't be serialized to localStorage, so the draft lives
 * for the lifetime of the tab. (Future: upload to storage, keep only the URL.)
 */

let draft                      = null;

export const draftStore = {
  set(next              ) {
    draft = next;
  },
  patch(patch                       ) {
    if (draft) draft = { ...draft, ...patch };
  },
  get() {
    return draft;
  },
  clear() {
    draft = null;
  },
};

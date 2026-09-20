import { supabase } from "../supabase";

let documentsPromise = null;

// TopHeader, Home, and DocumentsPage each need the same `documents` table —
// without this, all three fire an identical query independently on every
// page load (Lighthouse flagged the duplicate round trips as a chained
// critical-path cost on the homepage). Caching the in-flight/resolved
// promise means the first caller triggers the fetch and everyone else on
// the same page load just awaits it.
export function fetchDocuments() {
  if (!documentsPromise) {
    documentsPromise = supabase
      .from("documents")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error || !data?.length) {
          documentsPromise = null;
          return [];
        }
        return data;
      })
      .catch(() => {
        documentsPromise = null;
        return [];
      });
  }
  return documentsPromise;
}

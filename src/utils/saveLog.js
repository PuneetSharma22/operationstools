import { supabase } from "../supabase";

// Analytics-only logging of "someone exported a document". This must never
// block or fail an export — the PDF is generated entirely client-side and is
// useful whether or not the row lands — but it must not fail *silently*
// either: a swallowed error here is how a broken table or an expired anon key
// goes unnoticed for weeks.

/**
 * Records one export in `save_requests`.
 *
 * @param {object} args
 * @param {string} args.template  template id, e.g. "thermal-full"
 * @param {string} args.printId   unique id shown to support
 * @param {object} [args.billData] full document payload
 * @param {string} [args.table]   defaults to "save_requests"
 * @returns {Promise<{ ok: boolean, error?: unknown }>} never rejects
 */
export async function logSaveRequest({ template, printId, billData, table = "save_requests" }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const row = { template, print_id: printId, user_id: user?.id ?? null };
    if (billData !== undefined) row.bill_data = billData;
    const { error } = await supabase.from(table).insert(row);
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.warn(
      `Save logging failed for template "${template}" (print id ${printId}). ` +
      "The document itself was unaffected — this only skips analytics.",
      error
    );
    return { ok: false, error };
  }
}

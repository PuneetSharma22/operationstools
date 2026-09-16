// Shared bill-math helper for all Fuel Bill templates and the bulk
// generator — the fuel counterpart of components/restaurant/billMath.js.
//
// Calculation order, and why it is this way round:
//
//   1. Rate (₹/litre) and Amount (₹) are what a real dispenser is preset
//      with — "Preset Type: Amount" is the default on the form — so they are
//      the authoritative, user-entered facts.
//   2. Volume/quantity is DERIVED: quantity = amount ÷ rate, rounded to 2dp.
//      It is never typed directly, because a hand-typed volume that doesn't
//      agree with amount ÷ rate produces a receipt that fails the first
//      sanity check anyone applies to it.
//   3. The printed total prefers the entered `amount`. Bulk CSV generation
//      does set amount, but a row that somehow lacks one falls back to
//      quantity × rate so the receipt is still internally consistent.
//
// Every input goes through toNumber(), which returns 0 rather than NaN, and
// the returned `hasInvalidInput` flag lets the UI say so instead of quietly
// printing a wrong receipt.

/** Parses a form value to a finite number, falling back to 0 (never NaN). */
export function toNumber(raw) {
  if (raw === "" || raw === null || raw === undefined) return 0;
  const n = typeof raw === "number" ? raw : parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

/** True when a non-empty value could not be read as a non-negative number. */
export function isInvalidAmount(raw) {
  if (raw === "" || raw === null || raw === undefined) return false;
  const n = typeof raw === "number" ? raw : Number(String(raw).trim());
  return !Number.isFinite(n) || n < 0;
}

/**
 * Volume dispensed, derived from amount ÷ rate.
 * Returns "" (not "0.00" and not "NaN") when either side is missing or zero,
 * matching what the form shows in its read-only Volume box.
 *
 * @returns {string} two-decimal litres, or ""
 */
export function computeQuantity(amount, pricePerLitre) {
  const amt = toNumber(amount);
  const rate = toNumber(pricePerLitre);
  return amt > 0 && rate > 0 ? (amt / rate).toFixed(2) : "";
}

/**
 * The single source of truth for what a fuel template prints.
 *
 * @param {object} data the fuel bill record
 * @returns {{ qty: number, rate: number, total: number, hasInvalidInput: boolean }}
 */
export function computeTotals(data = {}) {
  // Clamped to 0 rather than left negative — these feed printed/exported
  // receipts directly, so a stray "-50" must never reach a template.
  const qty = Math.max(0, toNumber(data.quantity));
  const rate = Math.max(0, toNumber(data.pricePerLitre));
  const hasInvalidInput = isInvalidAmount(data.amount) || isInvalidAmount(data.pricePerLitre);

  // Amount is the authoritative user-entered value when present (single-bill
  // form flow); fall back to qty × rate otherwise.
  const hasAmount = data.amount !== undefined && data.amount !== "" && data.amount !== null;
  const rawTotal = hasAmount ? toNumber(data.amount) : qty * rate;
  const total = hasInvalidInput ? 0 : Math.max(0, rawTotal);

  return { qty, rate, total, hasInvalidInput };
}

/**
 * Thermal/dot-matrix receipts print fixed-width numeric columns, zero-padded
 * to 9 characters (e.g. "001000.00"). Values wider than that are left as-is
 * rather than truncated.
 */
export function fmtPadded(n) {
  return toNumber(n).toFixed(2).padStart(9, "0");
}

/** Amount column on a thermal receipt. */
export const fmtAmt = fmtPadded;
/** Volume column on a thermal receipt. */
export const fmtVol = fmtPadded;

/** DD/MM/YY — the compact thermal-receipt date. */
export function formatDateShort(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yy = String(dt.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

/** DD/MM/YYYY — the POS-style date. */
export function formatDateLong(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}

/** ₹1,234.50 — used wherever a fuel figure is shown outside a template. */
export function formatINR(amount) {
  return (
    "₹" +
    toNumber(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

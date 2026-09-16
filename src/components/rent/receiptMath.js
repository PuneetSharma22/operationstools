// Shared receipt-math helper for all Rent Receipt templates — the rent
// counterpart of components/restaurant/billMath.js and
// components/fuel/billMath.js.
//
// A rent receipt has no multi-line arithmetic: one amount, one period. What
// it does have is four templates that each used to carry their own copies of
// the amount-to-words converter and three or four date formatters, drifting
// apart as they went. Order of operations here:
//
//   1. rentAmount is parsed once, safely — a blank box, a stray letter or a
//      pasted "-500" must never reach the receipt as NaN.
//   2. Figures are printed as whole rupees, Indian-grouped (15,000).
//   3. Words are derived from the same parsed integer, so the figure and the
//      words can never disagree.

/** Parses a rent amount to a finite, non-negative number (never NaN). */
export function toAmount(raw) {
  if (raw === "" || raw === null || raw === undefined) return 0;
  const n = typeof raw === "number" ? raw : parseFloat(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/** True when a non-empty value can't be read as a non-negative amount. */
export function isInvalidAmount(raw) {
  if (raw === "" || raw === null || raw === undefined) return false;
  const n = typeof raw === "number" ? raw : Number(String(raw).trim());
  return !Number.isFinite(n) || n < 0;
}

/**
 * Rent in figures: whole rupees, Indian digit grouping, no symbol.
 * Returns "" for a blank amount so a template can print its own placeholder,
 * and "0" (never "NaN") for junk.
 */
export function formatRentFigure(raw) {
  if (raw === "" || raw === null || raw === undefined) return "";
  return Math.trunc(toAmount(raw)).toLocaleString("en-IN");
}

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

/** Indian-numbering word form of a whole number (no "Rupees" suffix). */
function numToWords(n) {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
  if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
  if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
  return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numToWords(n % 10000000) : "");
}

/**
 * "Fifteen Thousand Rupees Only" — the amount-in-words line every HRA-ready
 * receipt carries. Returns "" for blank/zero/invalid amounts so the caller
 * can simply omit the line.
 */
export function amountToWords(raw) {
  const n = Math.trunc(toAmount(raw));
  if (n <= 0) return "";
  return numToWords(n) + " Rupees Only";
}

/**
 * Formats a receipt date.
 *
 * @param {string} d            ISO date, e.g. "2026-06-25"
 * @param {object} [opts]
 * @param {"long"|"short"|"numeric"} [opts.style]
 *        long    -> "25 June 2026"    (Certificate / Duplicate Book)
 *        short   -> "25 Jun 2026"     (Minimal)
 *        numeric -> "25/06/2026"      (Formal Table)
 * @param {string} [opts.placeholder] what to show when `d` is empty
 */
export function formatReceiptDate(d, { style = "long", placeholder = "" } = {}) {
  if (!d) return placeholder;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return placeholder;
  if (style === "numeric") {
    return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
  }
  return dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: style === "short" ? "short" : "long",
    year: "numeric",
  });
}

/**
 * Formats a rental period from a `<input type="month">` value ("YYYY-MM").
 *
 * The "-02" appended below is deliberate: parsing "2026-06" gives UTC
 * midnight on the 1st, which rolls back to May for anyone west of UTC.
 * Anchoring on the 2nd keeps the month correct in every timezone.
 *
 * @param {string} d               "YYYY-MM"
 * @param {object} [opts]
 * @param {boolean} [opts.withYear] include the year ("June 2026" vs "June")
 * @param {string}  [opts.placeholder]
 */
export function formatPeriod(d, { withYear = true, placeholder = "" } = {}) {
  if (!d) return placeholder;
  const dt = new Date(d + "-02");
  if (Number.isNaN(dt.getTime())) return placeholder;
  return dt.toLocaleDateString("en-IN", withYear ? { month: "long", year: "numeric" } : { month: "long" });
}

/**
 * Renders a period range, collapsing "same month to same month" down to a
 * single label — which is the common case, since most receipts cover one
 * month.
 */
export function formatPeriodRange(from, to, opts = {}) {
  const start = formatPeriod(from, opts);
  if (!to || from === to) return start;
  return `${start} – ${formatPeriod(to, opts)}`;
}

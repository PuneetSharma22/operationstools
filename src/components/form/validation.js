// Lightweight, dependency-free validation for the numeric fields on the bill
// forms. `min="0"` on an <input type="number"> is only advisory — a user can
// still paste "-50" or "12abc" and the browser will happily hand it to React —
// so every money/quantity field runs through validateNumber() and every total
// runs through safeNumber(), which can never produce NaN.

/** True for values the user simply hasn't filled in yet. */
export function isBlank(raw) {
  return raw === "" || raw === null || raw === undefined;
}

/**
 * Coerces anything to a finite number, falling back to 0.
 *
 * This is the guard that keeps a total from rendering as "NaN": the callers
 * pair it with an `hasInvalidInput` flag so the UI can show a warning rather
 * than silently pretending a garbage input meant zero.
 */
export function safeNumber(raw, fallback = 0) {
  const n = typeof raw === "number" ? raw : parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Validates one numeric form field.
 *
 * @param {string|number} raw       the raw input value
 * @param {object}  [opts]
 * @param {string}  [opts.label]    field name used in the message
 * @param {boolean} [opts.required] blank counts as an error
 * @param {number}  [opts.min]      inclusive lower bound (default 0)
 * @param {number}  [opts.max]      inclusive upper bound
 * @param {boolean} [opts.integer]  reject fractional values
 * @returns {string} "" when valid, otherwise a user-facing message
 */
export function validateNumber(raw, opts = {}) {
  const { label = "This field", required = false, min = 0, max, integer = false } = opts;

  if (isBlank(raw)) return required ? `${label} is required.` : "";

  const n = typeof raw === "number" ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n)) return `${label} must be a number.`;
  if (min !== undefined && n < min) {
    return min === 0 ? `${label} cannot be negative.` : `${label} must be at least ${min}.`;
  }
  if (max !== undefined && n > max) return `${label} cannot be more than ${max}.`;
  if (integer && !Number.isInteger(n)) return `${label} must be a whole number.`;
  return "";
}

/**
 * Clamps a raw input to a valid range, preserving "" so a field can be
 * cleared. Used by handlers that want to refuse a bad value outright
 * (e.g. a negative quantity) rather than only flag it.
 */
export function clampNumber(raw, { min = 0, max } = {}) {
  if (isBlank(raw)) return "";
  const n = Number(String(raw).trim());
  if (!Number.isFinite(n)) return "";
  let out = n;
  if (min !== undefined && out < min) out = min;
  if (max !== undefined && out > max) out = max;
  return out;
}

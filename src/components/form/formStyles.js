// Shared Tailwind class strings for every generator form (fuel, restaurant,
// rent). These were previously copy-pasted byte-for-byte into each form file;
// they live here so a design tweak lands in one place.
//
// Colours come from the `@theme` tokens declared in src/index.css
// (--color-ink, --color-border, …) rather than repeated arbitrary hex values.

export const inputClass =
  "w-full h-11 px-4 bg-white border border-border rounded-xl text-ink text-[14px] focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all duration-150 placeholder:text-ink-faint";

// Same shape as inputClass but red-tinted — used when a field fails validation.
export const inputErrorClass =
  "w-full h-11 px-4 bg-white border border-danger-border rounded-xl text-ink text-[14px] focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10 transition-all duration-150 placeholder:text-ink-faint";

// Read-only/derived values (e.g. fuel Volume = Amount ÷ Rate).
export const computedInputClass =
  "w-full h-11 px-4 bg-surface-alt border border-border rounded-xl text-ink-soft text-[14px] cursor-not-allowed";

export const labelClass = "block text-ink text-[13px] font-medium mb-1.5";

export const helperClass = "text-[11.5px] text-ink-faint mt-1";

export const errorClass = "text-[11.5px] text-danger mt-1";

// Inline, non-blocking warning strip — same visual language as the CSV-error
// banners already used in the bulk-generation modals.
export const warningBannerClass =
  "mt-3 rounded-lg border border-danger-border bg-danger-surface px-3 py-2 text-[12px] text-danger";

/**
 * Picks the right input class for a field that may be in an error state.
 * @param {string} [error] validation message, if any
 * @param {string} [base] class to use when valid (defaults to inputClass)
 */
export function inputClassFor(error, base = inputClass) {
  return error ? inputErrorClass : base;
}

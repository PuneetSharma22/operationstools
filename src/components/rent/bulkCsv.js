import { resolveOptional } from "../../utils/csv";

// Column contract for rent-receipt bulk generation, plus the pure row
// resolver shared by the preview table and the generator.
//
// Same required/optional philosophy as the fuel-bill bulk flow: only the
// facts that can't be sensibly defaulted are required. Property/landlord
// details default to the main form's current values (one landlord/property
// per batch is the common case); genuinely per-receipt fields (tenant name,
// receipt no, period, amount) default to blank or are auto-generated.

export const CSV_REQUIRED_COLUMNS = ["receipt_date", "rent_amount"];

export const CSV_COLUMN_ORDER = [
  "receipt_date", "receipt_no", "period_from", "period_to",
  "tenant_name", "rent_amount", "payment_method", "payment_ref",
  "property_address", "landlord_name", "landlord_pan",
];

export const CSV_OPTIONAL_COLUMNS = CSV_COLUMN_ORDER.filter((c) => !CSV_REQUIRED_COLUMNS.includes(c));
export const CSV_TEMPLATE_HEADERS = CSV_COLUMN_ORDER.join(",");
export const CSV_SAMPLE_ROW = "2026-07-01,001,2026-07,2026-07,Rajesh Sharma,15000,Cash,,\"Flat 4B, Sunrise Apartments, Andheri West, Mumbai\",Ramesh Kumar,ABCDE1234F";

/** Per-row validation of the two required columns. */
export function validateRentRow(row) {
  const rowErrors = [];
  if (!row.receipt_date) rowErrors.push("receipt_date required");
  if (!row.rent_amount || isNaN(Number(row.rent_amount))) rowErrors.push("rent_amount must be a number");
  return rowErrors;
}

/**
 * Builds the full resolved field set for one CSV row — used identically by
 * the preview table and the generator, so the two can never disagree.
 *
 * @param {object} row          raw `{ header: value }` row
 * @param {object} formData     the main form's current values, used as defaults
 * @param {number} index        0-based position among the *valid* rows
 */
export function resolveRow(row, formData, index) {
  return {
    receiptDate: row.receipt_date,
    rentAmount: parseFloat(row.rent_amount) || 0,
    receiptNo: resolveOptional(row.receipt_no, `REC-${String(index + 1).padStart(4, "0")}`),
    periodFrom: resolveOptional(row.period_from, formData.periodFrom),
    periodTo: resolveOptional(row.period_to, formData.periodTo),
    tenantName: resolveOptional(row.tenant_name, ""),
    paymentMethod: resolveOptional(row.payment_method, "Cash"),
    paymentRef: resolveOptional(row.payment_ref, ""),
    propertyAddress: resolveOptional(row.property_address, formData.propertyAddress),
    landlordName: resolveOptional(row.landlord_name, formData.landlordName),
    landlordPan: resolveOptional(row.landlord_pan, formData.landlordPan),
  };
}

/** Flattens a resolved row + the main form's data into one receipt record. */
export function toReceiptData(resolved, formData) {
  return {
    ...formData,
    receiptDate: resolved.receiptDate || formData.receiptDate,
    rentAmount: resolved.rentAmount || "",
    receiptNo: resolved.receiptNo.value,
    periodFrom: resolved.periodFrom.value,
    periodTo: resolved.periodTo.value,
    tenantName: resolved.tenantName.value,
    paymentMethod: resolved.paymentMethod.value,
    paymentRef: resolved.paymentRef.value,
    propertyAddress: resolved.propertyAddress.value,
    landlordName: resolved.landlordName.value,
    landlordPan: resolved.landlordPan.value,
  };
}

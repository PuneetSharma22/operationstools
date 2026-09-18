import { resolveOptional } from "../../utils/csv";
import { OPERATORS } from "./operatorThemes";

// Column contract for mobile-bill bulk generation. Each CSV row generates
// ONE document — either a postpaid tax invoice or a prepaid recharge
// receipt, chosen per row via bill_type. date + amount are the only facts
// that can't be sensibly defaulted (amount means plan rental for postpaid,
// recharge amount for prepaid). Everything else falls back to the main
// form's current values.

export const CSV_REQUIRED_COLUMNS = ["date", "amount"];

export const CSV_COLUMN_ORDER = [
  "operator", "bill_type", "customer_name", "mobile_number", "logo_url",
  "date", "amount", "plan_name", "gst_rate", "payment_mode", "invoice_no",
];

export const CSV_OPTIONAL_COLUMNS = CSV_COLUMN_ORDER.filter((c) => !CSV_REQUIRED_COLUMNS.includes(c));
export const CSV_TEMPLATE_HEADERS = CSV_COLUMN_ORDER.join(",");
export const CSV_SAMPLE_ROW = "airtel,postpaid,Rajesh Verma,9876543210,https://example.com/logo.png,2026-08-12,4999,Unlimited 4999 Plan,18,UPI,";

function isValidOperator(op) {
  return !op || Object.keys(OPERATORS).includes(op.toLowerCase());
}

/** Per-row validation of the required columns. */
export function validateMobileRow(row) {
  const rowErrors = [];
  if (!row.date) rowErrors.push("date required");
  if (!row.amount || isNaN(Number(row.amount))) rowErrors.push("amount must be a number");
  if (row.bill_type && !["postpaid", "prepaid"].includes(row.bill_type.toLowerCase())) rowErrors.push("bill_type must be postpaid or prepaid");
  if (!isValidOperator(row.operator)) rowErrors.push("operator must be airtel, jio, vi, bsnl or other");
  return rowErrors;
}

/**
 * Builds the full resolved field set for one CSV row — used identically by
 * the preview table and the generator.
 *
 * @param {object} row      raw `{ header: value }` row
 * @param {object} formData the main form's current values, used as defaults
 * @param {number} index    0-based position among the *valid* rows
 */
export function resolveRow(row, formData, index) {
  const billType = (row.bill_type || formData.billType || "postpaid").toLowerCase();
  const operator = (row.operator || formData.operator || "other").toLowerCase();
  return {
    date: row.date,
    amount: parseFloat(row.amount) || 0,
    billType,
    operator,
    operatorName: resolveOptional(row.operator ? OPERATORS[operator]?.name || row.operator : "", formData.operatorName),
    customerName: resolveOptional(row.customer_name, formData.customerName),
    mobileNumber: resolveOptional(row.mobile_number, formData.mobileNumber),
    logoUrl: resolveOptional(row.logo_url, formData.logoUrl),
    planName: resolveOptional(row.plan_name, billType === "prepaid" ? formData.rechargePlan : formData.planName),
    gstRate: resolveOptional(row.gst_rate, String(formData.gstRate ?? 18)),
    paymentMode: resolveOptional(row.payment_mode, formData.paymentMode),
    invoiceNo: resolveOptional(row.invoice_no, billType === "prepaid" ? `BLK-RCPT-${String(index + 1).padStart(4, "0")}` : `BLK-INV-${String(index + 1).padStart(4, "0")}`),
  };
}

/** Flattens a resolved row into one mobile-bill record. */
export function toBillData(resolved) {
  const base = {
    operator: resolved.operator,
    operatorName: resolved.operatorName.value,
    logoUrl: resolved.logoUrl.value,
    billType: resolved.billType,
    customerName: resolved.customerName.value,
    mobileNumber: resolved.mobileNumber.value,
    customerAddress: "",
  };
  if (resolved.billType === "prepaid") {
    return {
      ...base,
      receiptNo: resolved.invoiceNo.value,
      paymentDate: resolved.date,
      orderNo: "",
      paymentMode: resolved.paymentMode.value,
      rechargeAmount: resolved.amount,
      rechargePlan: resolved.planName.value,
      validity: "",
    };
  }
  return {
    ...base,
    invoiceNo: resolved.invoiceNo.value,
    invoiceDate: resolved.date,
    dueDate: "",
    billingPeriod: "",
    planName: resolved.planName.value,
    gstin: "",
    pan: "",
    planRental: resolved.amount,
    gstRate: Number(resolved.gstRate.value) || 0,
    lateFee: 0,
    previousBalance: 0,
  };
}

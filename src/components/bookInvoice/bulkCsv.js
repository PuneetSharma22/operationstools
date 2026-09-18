import { resolveOptional } from "../../utils/csv";

// Column contract for book-invoice bulk generation. Each CSV row generates
// ONE single-item invoice (same "one row = one document" model as the fuel
// and rent bulk generators) — book_title, qty and rate are the only facts
// that can't be sensibly defaulted. Everything else falls back to whatever
// the main form's store/payment settings currently are, so a normal
// same-store batch can leave those columns blank.

export const CSV_REQUIRED_COLUMNS = ["date", "book_title", "qty", "rate"];

export const CSV_COLUMN_ORDER = [
  "store_name", "store_address", "store_gstin", "store_phone", "logo_url", "payment_mode",
  "date", "invoice_no",
  "book_title", "author", "hsn", "qty", "rate", "gst_rate",
  "customer_name", "customer_phone",
];

export const CSV_OPTIONAL_COLUMNS = CSV_COLUMN_ORDER.filter((c) => !CSV_REQUIRED_COLUMNS.includes(c));
export const CSV_TEMPLATE_HEADERS = CSV_COLUMN_ORDER.join(",");
export const CSV_SAMPLE_ROW = "Nandan Book Store,\"G-45, Punchkuia Marg, Sector 46, Gurugram, Haryana - 122003\",06AABCU9603R1Z5,9820011223,https://example.com/logo.png,UPI,2026-07-11,,Best of Indian Mythology,Amar Chitra Katha,4901,1,499,5,Rajesh Verma,9876543210";

/** Per-row validation of the required columns. */
export function validateBookRow(row) {
  const rowErrors = [];
  if (!row.date) rowErrors.push("date required");
  if (!row.book_title) rowErrors.push("book_title required");
  if (!row.qty || isNaN(Number(row.qty))) rowErrors.push("qty must be a number");
  if (!row.rate || isNaN(Number(row.rate))) rowErrors.push("rate must be a number");
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
  return {
    date: row.date,
    storeName: resolveOptional(row.store_name, formData.store.name),
    storeAddress: resolveOptional(row.store_address, formData.store.address),
    storeGstin: resolveOptional(row.store_gstin, formData.store.gstin),
    storePhone: resolveOptional(row.store_phone, formData.store.phone),
    logoUrl: resolveOptional(row.logo_url, formData.logoUrl),
    paymentMode: resolveOptional(row.payment_mode, formData.paymentMode),
    invoiceNo: resolveOptional(row.invoice_no, `BLK-${String(index + 1).padStart(4, "0")}`),
    bookTitle: row.book_title,
    author: resolveOptional(row.author, ""),
    hsn: resolveOptional(row.hsn, "4901"),
    qty: parseFloat(row.qty) || 0,
    rate: parseFloat(row.rate) || 0,
    gstRate: resolveOptional(row.gst_rate, "5"),
    customerName: resolveOptional(row.customer_name, ""),
    customerPhone: resolveOptional(row.customer_phone, ""),
  };
}

/** Flattens a resolved row into one book-invoice bill record. */
export function toBillData(resolved) {
  return {
    invoiceNo: resolved.invoiceNo.value,
    invoiceDate: resolved.date,
    paymentMode: resolved.paymentMode.value,
    logoUrl: resolved.logoUrl.value,
    store: {
      name: resolved.storeName.value,
      address: resolved.storeAddress.value,
      gstin: resolved.storeGstin.value,
      phone: resolved.storePhone.value,
      email: "",
    },
    customer: {
      name: resolved.customerName.value,
      address: "",
      phone: resolved.customerPhone.value,
    },
    items: [{
      id: `${Date.now()}-${Math.random()}`,
      description: resolved.bookTitle,
      author: resolved.author.value,
      hsn: resolved.hsn.value,
      qty: resolved.qty,
      rate: resolved.rate,
      gstRate: Number(resolved.gstRate.value) || 0,
    }],
  };
}

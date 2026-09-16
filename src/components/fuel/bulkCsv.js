import { resolveOptional } from "../../utils/csv";
import { computeQuantity } from "./billMath";

// Column contract for fuel-bill bulk generation, plus the pure row resolver
// shared by the preview table and the generator itself.
//
// Required: date, price_per_litre, amount — the only facts that can't be
// sensibly defaulted. Volume/quantity is NOT a column at all: like the
// single-bill form, it is derived from amount ÷ rate rather than typed.
// Everything else is optional; a blank cell gets a sensible default (falling
// back to whatever the main form currently has — including station_name,
// logo_url, etc.), so you can leave them blank for a normal same-station
// batch, or fill them per-row to generate bills for a different station on
// specific rows. Typing the literal text "NA" explicitly means "leave this
// blank" and skips the default entirely.

export const CSV_REQUIRED_COLUMNS = ["date", "price_per_litre", "amount"];

export const CSV_COLUMN_ORDER = [
  "station_name", "station_address", "station_phone", "gst_no", "logo_url", "bank_logo_url",
  "date", "time", "bill_number", "invoice_no",
  "vehicle_number", "vehicle_type", "customer_name", "mobile_no",
  "fuel_type", "price_per_litre", "amount", "density", "preset_type", "payment_mode",
  "nozzle_no", "attendant_id",
];

export const CSV_OPTIONAL_COLUMNS = CSV_COLUMN_ORDER.filter((c) => !CSV_REQUIRED_COLUMNS.includes(c));
export const CSV_TEMPLATE_HEADERS = CSV_COLUMN_ORDER.join(",");
export const CSV_SAMPLE_ROW = "PK FUEL STATION,\"PAREKH NAGAR S V RD, KANDIVALI W, MUMBAI - 400067\",38055913,27AABCU9603R1ZX,https://example.com/logo.png,https://example.com/bank-logo.png,2026-07-10,14:30,G64695,927267,MH12AB1234,4W,Rajesh Sharma,9876543210,Petrol,104.29,992.00,745.0,Amount,Cash,N-02,AT-102";

/** Per-row validation of the three required columns. */
export function validateFuelRow(row) {
  const rowErrors = [];
  if (!row.date) rowErrors.push("date required");
  if (!row.price_per_litre || isNaN(Number(row.price_per_litre))) rowErrors.push("price_per_litre must be a number");
  if (!row.amount || isNaN(Number(row.amount))) rowErrors.push("amount must be a number");
  return rowErrors;
}

/**
 * Builds the full resolved field set for one CSV row — used identically by
 * the preview table (so what you see is what you get) and by the generator.
 *
 * @param {object} row          raw `{ header: value }` row
 * @param {object} stationData  the main form's current values, used as defaults
 * @param {number} index        0-based position among the *valid* rows
 */
export function resolveRow(row, stationData, index) {
  const rate = parseFloat(row.price_per_litre) || 0;
  const amount = parseFloat(row.amount) || 0;
  return {
    date: row.date,
    rate,
    amount,
    // Volume is derived (amount ÷ rate), same as the single-bill form — never
    // a raw CSV column, since a user typing it independently risks it not
    // matching amount/rate at all.
    quantity: computeQuantity(amount, rate),
    // Station identity — defaults to the main form's current value, so a
    // normal same-station batch can leave these blank entirely, while a
    // specific row can still override to generate for a different station.
    stationName: resolveOptional(row.station_name, stationData.stationName),
    stationAddress: resolveOptional(row.station_address, stationData.stationAddress),
    stationPhone: resolveOptional(row.station_phone, stationData.stationPhone),
    vatTin: resolveOptional(row.gst_no, stationData.vatTin),
    logoUrl: resolveOptional(row.logo_url, stationData.logoUrl),
    bankLogoUrl: resolveOptional(row.bank_logo_url, stationData.bankLogoUrl),
    time: resolveOptional(row.time, stationData.billTime),
    billNumber: resolveOptional(row.bill_number, `BLK-${String(index + 1).padStart(4, "0")}`),
    // Genuinely unique-per-transaction identifier — default to blank rather
    // than duplicating the main form's single value across the whole batch.
    invoiceNo: resolveOptional(row.invoice_no, ""),
    // Vehicle / customer — no shared default makes sense across a batch.
    vehicleNumber: resolveOptional(row.vehicle_number, ""),
    vehicleType: resolveOptional(row.vehicle_type, "4W"),
    customerName: resolveOptional(row.customer_name, ""),
    mobileNo: resolveOptional(row.mobile_no, ""),
    // Fuel / payment.
    fuelType: resolveOptional(row.fuel_type, "Petrol"),
    density: resolveOptional(row.density, stationData.density),
    presetType: resolveOptional(row.preset_type, stationData.presetType),
    paymentMode: resolveOptional(row.payment_mode, "Cash"),
    // Dispenser info — typically stable across one station's batch.
    nozzleNo: resolveOptional(row.nozzle_no, stationData.nozzleNo),
    attendantId: resolveOptional(row.attendant_id, stationData.attendantId),
  };
}

/** Flattens a resolved row + the main form's data into one bill record. */
export function toBillData(resolved, stationData) {
  return {
    ...stationData,
    stationName: resolved.stationName.value,
    stationAddress: resolved.stationAddress.value,
    stationPhone: resolved.stationPhone.value,
    vatTin: resolved.vatTin.value,
    logoUrl: resolved.logoUrl.value,
    bankLogoUrl: resolved.bankLogoUrl.value,
    billDate: resolved.date || stationData.billDate,
    billTime: resolved.time.value,
    billNumber: resolved.billNumber.value,
    invoiceNo: resolved.invoiceNo.value,
    vehicleNumber: resolved.vehicleNumber.value,
    vehicleType: resolved.vehicleType.value,
    customerName: resolved.customerName.value,
    mobileNo: resolved.mobileNo.value,
    fuelType: resolved.fuelType.value,
    density: resolved.density.value,
    presetType: resolved.presetType.value,
    paymentMode: resolved.paymentMode.value,
    nozzleNo: resolved.nozzleNo.value,
    attendantId: resolved.attendantId.value,
    pricePerLitre: resolved.rate || "",
    amount: resolved.amount || "",
    quantity: resolved.quantity,
  };
}

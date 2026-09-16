import PropTypes from "prop-types";
import Field from "../form/Field";
import Section from "../form/Section";
import { inputClass, computedInputClass, inputClassFor, warningBannerClass } from "../form/formStyles";
import { validateNumber } from "../form/validation";

// Typical real-world densities (kg/m3) by fuel type — used as placeholder
// guidance rather than a hard rule, since actual density varies by batch/season.
const DENSITY_HINTS = {
  Petrol: "745.0",
  Diesel: "832.0",
  "Xtra Premium": "742.0",
};
const DENSITY_APPLICABLE = ["Petrol", "Diesel", "Xtra Premium"];

// NOTE: this form is identical for every template (per redesign request).
// Every field here is read by at least one template; where a specific
// template doesn't visually surface a field, that's a template bug to fix
// on that template's side, not a reason to hide the field here — switching
// templates should never make fields appear/disappear.
//
// Rate & Amount are the two things a real fuel dispenser is preset with
// (this matches "Preset Type: Amount" being the default) — Volume/Qty is
// therefore derived (Amount ÷ Rate) rather than typed directly. The parent
// page computes this derived value in its onChange handler; this component
// just renders `quantity` as a disabled, clearly-labelled computed field.
export default function BillForm({ data, onChange }) {
  // Validation is recomputed on every render from the current values rather
  // than held in state — there is no submit step here, the receipt updates
  // live, so "is this value usable right now?" is the only question.
  const errors = {
    pricePerLitre: validateNumber(data.pricePerLitre, { label: "Rate / litre", min: 0 }),
    amount: validateNumber(data.amount, { label: "Amount", min: 0 }),
    density: validateNumber(data.density, { label: "Density", min: 0 }),
  };
  const hasAmountError = Boolean(errors.pricePerLitre || errors.amount);

  return (
    <div>
      {/* Station Details */}
      <Section title="⛽ Station Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Station Name" htmlFor="stationName">
              <input id="stationName" className={inputClass} name="stationName" value={data.stationName} onChange={onChange} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Station Address" htmlFor="stationAddress">
              <input id="stationAddress" className={inputClass} name="stationAddress" value={data.stationAddress} onChange={onChange} />
            </Field>
          </div>
          <Field label="Phone Number" htmlFor="stationPhone">
            <input id="stationPhone" className={inputClass} name="stationPhone" value={data.stationPhone} onChange={onChange} />
          </Field>
          <Field label="GST No." htmlFor="vatTin">
            <input id="vatTin" className={inputClass} name="vatTin" value={data.vatTin} onChange={onChange} placeholder="e.g. 27AABCU9603R1ZX" />
          </Field>

          {/* Logo Image URL + Bank Strip Logo URL side by side */}
          <div>
            <Field label="Logo Image URL (optional)" htmlFor="logoUrl">
              <input id="logoUrl" className={inputClass} name="logoUrl" value={data.logoUrl} onChange={onChange} placeholder="https://example.com/logo.png" />
            </Field>
            {data.logoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={data.logoUrl}
                  alt="logo preview"
                  className="h-8 object-contain rounded border border-border p-1 bg-white"
                  onError={(e) => e.target.style.display = "none"}
                />
                <span className="text-[11.5px] text-ink-muted">Logo preview</span>
              </div>
            )}
          </div>
          <div>
            <Field label="Bank Strip Logo URL (optional)" htmlFor="bankLogoUrl">
              <input id="bankLogoUrl" className={inputClass} name="bankLogoUrl" value={data.bankLogoUrl} onChange={onChange} placeholder="https://example.com/bank-logo.png" />
            </Field>
            {data.bankLogoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={data.bankLogoUrl}
                  alt="bank logo preview"
                  className="h-8 object-contain rounded border border-border p-1 bg-white"
                  onError={(e) => e.target.style.display = "none"}
                />
                <span className="text-[11.5px] text-ink-muted">Rotated strip on receipt</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Bill Details — grouped logically and packed 3-up where fields are
          short (IDs, dates), instead of every field eating a full half-row. */}
      <Section title="🧾 Bill Details" defaultOpen={true}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Receipt / Bill No." htmlFor="billNumber">
            <input id="billNumber" className={inputClass} name="billNumber" value={data.billNumber} onChange={onChange} />
          </Field>
          <Field label="Invoice No." htmlFor="invoiceNo">
            <input id="invoiceNo" className={inputClass} name="invoiceNo" value={data.invoiceNo} onChange={onChange} placeholder="e.g. 224105525C306687" />
          </Field>
          <Field label="Date" htmlFor="billDate">
            <input id="billDate" className={inputClass} type="date" name="billDate" value={data.billDate} onChange={onChange} />
          </Field>

          <Field label="Time" htmlFor="billTime">
            <input id="billTime" className={inputClass} type="time" name="billTime" value={data.billTime} onChange={onChange} />
          </Field>
          <Field label="Nozzle No." htmlFor="nozzleNo">
            <input id="nozzleNo" className={inputClass} name="nozzleNo" value={data.nozzleNo} onChange={onChange} placeholder="e.g. 4" />
          </Field>
        </div>
      </Section>

      {/* Fuel Details */}
      <Section title="🛢️ Fuel Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product / Fuel Type" htmlFor="fuelType">
            <select id="fuelType" className={inputClass} name="fuelType" value={data.fuelType} onChange={onChange}>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Xtra Premium</option>
              <option>CNG</option>
              <option>EV Charge</option>
            </select>
          </Field>
          <Field label="Rate / Litre (₹)" htmlFor="pricePerLitre" error={errors.pricePerLitre}>
            <input
              id="pricePerLitre"
              className={inputClassFor(errors.pricePerLitre)}
              type="number" min="0" step="0.01"
              name="pricePerLitre"
              value={data.pricePerLitre}
              onChange={onChange}
              placeholder="104.29"
              aria-invalid={Boolean(errors.pricePerLitre)}
            />
          </Field>

          <Field label="Amount (₹)" htmlFor="amount" error={errors.amount}>
            <input
              id="amount"
              className={inputClassFor(errors.amount)}
              type="number" min="0" step="0.01"
              name="amount"
              value={data.amount}
              onChange={onChange}
              placeholder="e.g. 2815.83"
              aria-invalid={Boolean(errors.amount)}
            />
          </Field>
          <Field label="Volume / Qty (Litres)" htmlFor="quantity" helper="Auto-calculated: Amount ÷ Rate">
            <input id="quantity" className={computedInputClass} type="text" name="quantity" value={data.quantity} disabled readOnly />
          </Field>

          {DENSITY_APPLICABLE.includes(data.fuelType) && (
            <Field label="Density (Kg/Cu.mtr)" htmlFor="density" error={errors.density}>
              <input
                id="density"
                className={inputClassFor(errors.density)}
                name="density"
                value={data.density}
                onChange={onChange}
                placeholder={`e.g. ${DENSITY_HINTS[data.fuelType]} (typical for ${data.fuelType})`}
                aria-invalid={Boolean(errors.density)}
              />
            </Field>
          )}
          <Field label="Preset Type" htmlFor="presetType">
            <select id="presetType" className={inputClass} name="presetType" value={data.presetType} onChange={onChange}>
              <option>Amount</option>
              <option>Volume</option>
              <option>Full Tank</option>
            </select>
          </Field>

          <Field label="Payment Mode" htmlFor="paymentMode">
            <select id="paymentMode" className={inputClass} name="paymentMode" value={data.paymentMode} onChange={onChange}>
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
              <option>Fleet Card</option>
            </select>
          </Field>
        </div>

        {/* Non-blocking warning: the receipt still renders, but the totals on
            it fall back to 0 rather than NaN while an input is unusable. */}
        {hasAmountError && (
          <p className={warningBannerClass} role="status">
            ⚠ Rate and Amount must be valid, non-negative numbers — the
            receipt is showing ₹0.00 for the invalid value until you fix it.
          </p>
        )}
      </Section>

      {/* Customer Details */}
      <Section title="🚗 Customer Details" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Customer Name" htmlFor="customerName">
            <input id="customerName" className={inputClass} name="customerName" value={data.customerName} onChange={onChange} placeholder="e.g. Rajesh Sharma" />
          </Field>
          <Field label="Vehicle Number" htmlFor="vehicleNumber">
            <input id="vehicleNumber" className={inputClass} name="vehicleNumber" value={data.vehicleNumber} onChange={onChange} placeholder="MH01AB1234" />
          </Field>
          <Field label="Vehicle Type" htmlFor="vehicleType">
            <select id="vehicleType" className={inputClass} name="vehicleType" value={data.vehicleType} onChange={onChange}>
              <option>4W</option>
              <option>2W</option>
              <option>HMV</option>
              <option>Auto</option>
              <option>Bus</option>
            </select>
          </Field>
          <Field label="Mobile No." htmlFor="mobileNo">
            <input id="mobileNo" className={inputClass} name="mobileNo" value={data.mobileNo} onChange={onChange} placeholder="Not Entered" />
          </Field>
          <Field label="Attendant ID" htmlFor="attendantId">
            <input id="attendantId" className={inputClass} name="attendantId" value={data.attendantId} onChange={onChange} placeholder="Not Available" />
          </Field>
        </div>
      </Section>
    </div>
  );
}

BillForm.propTypes = {
  /** The full fuel-bill record owned by FuelBillPage. */
  data: PropTypes.shape({
    stationName: PropTypes.string,
    stationAddress: PropTypes.string,
    stationPhone: PropTypes.string,
    vatTin: PropTypes.string,
    logoUrl: PropTypes.string,
    bankLogoUrl: PropTypes.string,
    billNumber: PropTypes.string,
    invoiceNo: PropTypes.string,
    billDate: PropTypes.string,
    billTime: PropTypes.string,
    nozzleNo: PropTypes.string,
    fuelType: PropTypes.string,
    density: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pricePerLitre: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    presetType: PropTypes.string,
    paymentMode: PropTypes.string,
    customerName: PropTypes.string,
    vehicleNumber: PropTypes.string,
    vehicleType: PropTypes.string,
    mobileNo: PropTypes.string,
    attendantId: PropTypes.string,
  }).isRequired,
  /** Native change handler — reads event.target.name / .value. */
  onChange: PropTypes.func.isRequired,
};

import { useState } from "react";

const inputClass = "w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all duration-150 placeholder:text-[#94a3b8]";
const computedInputClass = "w-full h-11 px-4 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[#475569] text-[14px] cursor-not-allowed";
const labelClass = "block text-[#0F172A] text-[13px] font-medium mb-1.5";
const helperClass = "text-[11.5px] text-[#94A3B8] mt-1";

// Typical real-world densities (kg/m3) by fuel type — used as placeholder
// guidance rather than a hard rule, since actual density varies by batch/season.
const DENSITY_HINTS = {
  Petrol: "745.0",
  Diesel: "832.0",
  "Xtra Premium": "742.0",
};
const DENSITY_APPLICABLE = ["Petrol", "Diesel", "Xtra Premium"];

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors duration-150"
        style={{ cursor: "pointer" }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#64748B]">
          {title}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Smooth animate using max-height trick */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.28s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="px-5 py-4 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

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
                  className="h-8 object-contain rounded border border-[#E2E8F0] p-1 bg-white"
                  onError={(e) => e.target.style.display = "none"}
                />
                <span className="text-[11.5px] text-[#64748B]">Logo preview</span>
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
                  className="h-8 object-contain rounded border border-[#E2E8F0] p-1 bg-white"
                  onError={(e) => e.target.style.display = "none"}
                />
                <span className="text-[11.5px] text-[#64748B]">Rotated strip on receipt</span>
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
          <Field label="TXN No." htmlFor="txnNo">
            <input id="txnNo" className={inputClass} name="txnNo" value={data.txnNo} onChange={onChange} />
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

          <Field label="Shift" htmlFor="shift">
            <input id="shift" className={inputClass} name="shift" value={data.shift} onChange={onChange} placeholder="S-1" />
          </Field>
          <Field label="Pump No." htmlFor="pumpNo">
            <input id="pumpNo" className={inputClass} name="pumpNo" value={data.pumpNo} onChange={onChange} placeholder="P-05" />
          </Field>
          <Field label="FIP No." htmlFor="fipNo">
            <input id="fipNo" className={inputClass} name="fipNo" value={data.fipNo} onChange={onChange} placeholder="e.g. 01" />
          </Field>

          <Field label="FCC ID" htmlFor="fccId">
            <input id="fccId" className={inputClass} name="fccId" value={data.fccId} onChange={onChange} placeholder="e.g. 000000001697748" />
          </Field>
          <Field label="Local ID" htmlFor="localId">
            <input id="localId" className={inputClass} name="localId" value={data.localId} onChange={onChange} />
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
          <Field label="Rate / Litre (₹)" htmlFor="pricePerLitre">
            <input id="pricePerLitre" className={inputClass} type="number" min="0" step="0.01" name="pricePerLitre" value={data.pricePerLitre} onChange={onChange} placeholder="104.29" />
          </Field>

          <Field label="Amount (₹)" htmlFor="amount">
            <input id="amount" className={inputClass} type="number" min="0" step="0.01" name="amount" value={data.amount} onChange={onChange} placeholder="e.g. 2815.83" />
          </Field>
          <div>
            <Field label="Volume / Qty (Litres)" htmlFor="quantity">
              <input id="quantity" className={computedInputClass} type="text" name="quantity" value={data.quantity} disabled readOnly />
            </Field>
            <p className={helperClass}>Auto-calculated: Amount ÷ Rate</p>
          </div>

          {DENSITY_APPLICABLE.includes(data.fuelType) && (
            <Field label="Density (Kg/Cu.mtr)" htmlFor="density">
              <input id="density" className={inputClass} name="density" value={data.density} onChange={onChange} placeholder={`e.g. ${DENSITY_HINTS[data.fuelType]} (typical for ${data.fuelType})`} />
            </Field>
          )}
          <Field label="Preset Type" htmlFor="presetType">
            <select id="presetType" className={inputClass} name="presetType" value={data.presetType} onChange={onChange}>
              <option>Amount</option>
              <option>Volume</option>
              <option>Full Tank</option>
            </select>
          </Field>

          <Field label="Atot (cumulative amt)" htmlFor="atot">
            <input id="atot" className={inputClass} name="atot" value={data.atot} onChange={onChange} placeholder="e.g. 00121730171.27" />
          </Field>
          <Field label="Vtot (cumulative vol)" htmlFor="vtot">
            <input id="vtot" className={inputClass} name="vtot" value={data.vtot} onChange={onChange} placeholder="e.g. 0001155464.120" />
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

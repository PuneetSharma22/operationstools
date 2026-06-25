import { useState, useRef } from "react";

const inputClass = "w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all duration-150 placeholder:text-[#94a3b8]";
const labelClass = "block text-[#0F172A] text-[13px] font-medium mb-1.5";

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);

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

export default function BillForm({ data, onChange, template }) {
  const isPos = template === "pos";
  const isThermal = template === "thermal-full" || template === "thermal-compact";
  const isIocl = template === "iocl";
  const isThermalFull = template === "thermal-full";

  const LogoField = (
    <div className="col-span-2">
      <Field label="Logo Image URL (optional)">
        <input className={inputClass} name="logoUrl" value={data.logoUrl} onChange={onChange} placeholder="https://example.com/logo.png" />
      </Field>
      {data.logoUrl && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={data.logoUrl}
            alt="logo preview"
            className="h-10 object-contain rounded border border-[#E2E8F0] p-1 bg-white"
            onError={(e) => e.target.style.display = "none"}
          />
          <span className="text-[12px] text-[#64748B]">Logo preview</span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Station Details */}
      <Section title="⛽ Station Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Station Name">
              <input className={inputClass} name="stationName" value={data.stationName} onChange={onChange} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Station Address">
              <input className={inputClass} name="stationAddress" value={data.stationAddress} onChange={onChange} />
            </Field>
          </div>
          <Field label="Phone Number">
            <input className={inputClass} name="stationPhone" value={data.stationPhone} onChange={onChange} />
          </Field>
          {(isPos || isIocl) && (
            <Field label="VAT TIN / GST No.">
              <input className={inputClass} name="vatTin" value={data.vatTin} onChange={onChange} placeholder="e.g. 7761395712V" />
            </Field>
          )}
          {isThermal && (
            <Field label="VAT No.">
              <input className={inputClass} name="vatTin" value={data.vatTin} onChange={onChange} />
            </Field>
          )}
          {isThermal && (
            <Field label="LST No.">
              <input className={inputClass} name="lstNumber" value={data.lstNumber} onChange={onChange} />
            </Field>
          )}
          {/* Logo URL — available for ALL templates */}
          {LogoField}
        </div>
      </Section>

      {/* Bill Details */}
      <Section title="🧾 Bill Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Receipt / Bill No.">
            <input className={inputClass} name="billNumber" value={data.billNumber} onChange={onChange} />
          </Field>
          {(isThermalFull || isPos) && (
            <Field label="Invoice No.">
              <input className={inputClass} name="invoiceNo" value={data.invoiceNo} onChange={onChange} placeholder="e.g. 224105525C306687" />
            </Field>
          )}
          <Field label="Date">
            <input className={inputClass} type="date" name="billDate" value={data.billDate} onChange={onChange} />
          </Field>
          <Field label="Time">
            <input className={inputClass} type="time" name="billTime" value={data.billTime} onChange={onChange} />
          </Field>
          {(isPos || isThermal) && (
            <Field label="Nozzle No.">
              <input className={inputClass} name="nozzleNo" value={data.nozzleNo} onChange={onChange} placeholder="e.g. 4" />
            </Field>
          )}
          {isIocl && (
            <>
              <Field label="Shift">
                <input className={inputClass} name="shift" value={data.shift} onChange={onChange} placeholder="S-1" />
              </Field>
              <Field label="Pump No.">
                <input className={inputClass} name="pumpNo" value={data.pumpNo} onChange={onChange} placeholder="P-05" />
              </Field>
              <Field label="Nozzle No.">
                <input className={inputClass} name="nozzleNo" value={data.nozzleNo} onChange={onChange} placeholder="N-02" />
              </Field>
            </>
          )}
          {isPos && (
            <Field label="TXN No.">
              <input className={inputClass} name="txnNo" value={data.txnNo} onChange={onChange} />
            </Field>
          )}
          {isThermalFull && (
            <>
              <Field label="FCC ID">
                <input className={inputClass} name="fccId" value={data.fccId} onChange={onChange} placeholder="e.g. 000000001697748" />
              </Field>
              <Field label="FIP No.">
                <input className={inputClass} name="fipNo" value={data.fipNo} onChange={onChange} placeholder="e.g. 01" />
              </Field>
              <Field label="Local ID">
                <input className={inputClass} name="localId" value={data.localId} onChange={onChange} />
              </Field>
            </>
          )}
        </div>
      </Section>

      {/* Fuel Details */}
      <Section title="🛢️ Fuel Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product / Fuel Type">
            <select className={inputClass} name="fuelType" value={data.fuelType} onChange={onChange}>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Xtra Premium</option>
              <option>CNG</option>
              <option>EV Charge</option>
            </select>
          </Field>
          <Field label="Rate / Litre (₹)">
            <input className={inputClass} type="number" name="pricePerLitre" value={data.pricePerLitre} onChange={onChange} placeholder="104.29" />
          </Field>
          <Field label="Volume / Qty (Litres)">
            <input className={inputClass} type="number" name="quantity" value={data.quantity} onChange={onChange} placeholder="30.20" />
          </Field>
          {(isPos || isThermalFull) && (
            <Field label="Density (Kg/Cu.mtr)">
              <input className={inputClass} name="density" value={data.density} onChange={onChange} placeholder="771.9" />
            </Field>
          )}
          {(isPos || isThermalFull) && (
            <Field label="Preset Type">
              <select className={inputClass} name="presetType" value={data.presetType} onChange={onChange}>
                <option>Amount</option>
                <option>Volume</option>
                <option>Full Tank</option>
              </select>
            </Field>
          )}
          {isThermalFull && (
            <>
              <Field label="Atot (cumulative amt)">
                <input className={inputClass} name="atot" value={data.atot} onChange={onChange} placeholder="e.g. 00121730171.27" />
              </Field>
              <Field label="Vtot (cumulative vol)">
                <input className={inputClass} name="vtot" value={data.vtot} onChange={onChange} placeholder="e.g. 0001155464.120" />
              </Field>
            </>
          )}
          <Field label="Payment Mode">
            <select className={inputClass} name="paymentMode" value={data.paymentMode} onChange={onChange}>
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
          <Field label="Customer Name">
            <input className={inputClass} name="customerName" value={data.customerName} onChange={onChange} placeholder="e.g. Puneet Sharma" />
          </Field>
          <Field label="Vehicle Number">
            <input className={inputClass} name="vehicleNumber" value={data.vehicleNumber} onChange={onChange} placeholder="MH01AB1234" />
          </Field>
          <Field label="Vehicle Type">
            <select className={inputClass} name="vehicleType" value={data.vehicleType} onChange={onChange}>
              <option>4W</option>
              <option>2W</option>
              <option>HMV</option>
              <option>Auto</option>
              <option>Bus</option>
            </select>
          </Field>
          {(isThermal || isPos) && (
            <Field label="Mobile No.">
              <input className={inputClass} name="mobileNo" value={data.mobileNo} onChange={onChange} placeholder="Not Entered" />
            </Field>
          )}
          {isThermalFull && (
            <Field label="Attendant ID">
              <input className={inputClass} name="attendantId" value={data.attendantId} onChange={onChange} placeholder="Not Available" />
            </Field>
          )}
        </div>
      </Section>
    </div>
  );
}

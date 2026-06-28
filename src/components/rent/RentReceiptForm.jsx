import { useState } from "react";

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
  return (
    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors duration-150"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#64748B]">{title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}>
        <div style={{ overflow: "hidden" }}>
          <div className="px-5 py-4 bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function RentReceiptForm({ data, onChange }) {
  return (
    <div>
      <Section title="🧾 Receipt Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Receipt No.">
            <input className={inputClass} name="receiptNo" value={data.receiptNo} onChange={onChange} placeholder="001" />
          </Field>
          <Field label="Receipt Date">
            <input className={inputClass} type="date" name="receiptDate" value={data.receiptDate} onChange={onChange} />
          </Field>
          <Field label="Period From">
            <input className={inputClass} type="month" name="periodFrom" value={data.periodFrom} onChange={onChange} />
          </Field>
          <Field label="Period To">
            <input className={inputClass} type="month" name="periodTo" value={data.periodTo} onChange={onChange} />
          </Field>
        </div>
      </Section>

      <Section title="💰 Rent Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Rent Amount (₹)">
              <input className={inputClass} type="number" name="rentAmount" value={data.rentAmount} onChange={onChange} placeholder="e.g. 15000" />
            </Field>
          </div>
          <Field label="Payment Method">
            <select className={inputClass} name="paymentMethod" value={data.paymentMethod} onChange={onChange}>
              <option>Cash</option>
              <option>Cheque</option>
              <option>NEFT</option>
              <option>IMPS</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>
          </Field>
          <Field label="Reference / Cheque No. (optional)">
            <input className={inputClass} name="paymentRef" value={data.paymentRef} onChange={onChange} placeholder="UTR / Cheque No." />
          </Field>
        </div>
      </Section>

      <Section title="🏠 Property Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Property Address">
              <input className={inputClass} name="propertyAddress" value={data.propertyAddress} onChange={onChange} placeholder="Flat 4B, Sunrise Apartments, Andheri West, Mumbai - 400053" />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="👤 Tenant Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Tenant Name">
              <input className={inputClass} name="tenantName" value={data.tenantName} onChange={onChange} placeholder="e.g. Rajesh Sharma" />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="🏦 Landlord Details" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Landlord Name">
              <input className={inputClass} name="landlordName" value={data.landlordName} onChange={onChange} placeholder="e.g. Ramesh Kumar" />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Landlord PAN">
              <input className={inputClass} name="landlordPan" value={data.landlordPan} onChange={onChange} placeholder="ABCDE1234F" style={{ textTransform: "uppercase" }} />
            </Field>
          </div>
        </div>
      </Section>
    </div>
  );
}

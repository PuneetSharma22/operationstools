import { useState } from "react";

const inputClass = "w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all duration-150 placeholder:text-[#94a3b8]";
const labelClass = "block text-[#0F172A] text-[13px] font-medium mb-1.5";
const helperClass = "text-[11.5px] text-[#94A3B8] mt-1";

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
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}>
        <div style={{ overflow: "hidden" }}>
          <div className="px-5 py-4 bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}

// NOTE: same philosophy as the fuel bill's BillForm — every field here is
// read by at least one template (TXN/Invoice No -> POS, Order No/Waiter ID/
// FSSAI -> Thermal Full), so the form doesn't change shape when you switch
// templates. A field a given template doesn't show is a template-side
// choice, not something to hide here.
export default function BillForm({ data, onChange, onLogoChange }) {
  const set = (name) => (e) => onChange({ [name]: e.target.value });
  const setNum = (name) => (e) => onChange({ [name]: e.target.value === "" ? "" : Number(e.target.value) });

  const updateItem = (index, field, value) => {
    const items = data.items.map((it, i) =>
      i === index ? { ...it, [field]: field === "name" ? value : Number(value) } : it
    );
    onChange({ items });
  };

  const addItem = () => {
    onChange({ items: [...data.items, { name: "", qty: 1, price: 0 }] });
  };

  const removeItem = (index) => {
    onChange({ items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <div>
      {/* Restaurant Details */}
      <Section title="🍽️ Restaurant Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Restaurant Name" htmlFor="restaurantName">
              <input id="restaurantName" className={inputClass} value={data.restaurantName} onChange={set("restaurantName")} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Address" htmlFor="address">
              <input id="address" className={inputClass} value={data.address} onChange={set("address")} />
            </Field>
          </div>
          <Field label="Established Year" htmlFor="establishedYear">
            <input id="establishedYear" className={inputClass} value={data.establishedYear} onChange={set("establishedYear")} placeholder="e.g. 1931" />
          </Field>
          <Field label="GSTIN" htmlFor="gstin">
            <input id="gstin" className={inputClass} value={data.gstin} onChange={set("gstin")} placeholder="e.g. 27AABCU9603R1ZX" />
          </Field>
          <Field label="FSSAI No." htmlFor="fssaiNo">
            <input id="fssaiNo" className={inputClass} value={data.fssaiNo} onChange={set("fssaiNo")} placeholder="14-digit license no." />
          </Field>
          <div>
            <Field label="Logo URL (optional)" htmlFor="logoUrl">
              <input
                id="logoUrl"
                className={inputClass}
                value={data.logoUrl}
                onChange={(e) => (onLogoChange ? onLogoChange(e.target.value) : onChange({ logoUrl: e.target.value }))}
                placeholder="https://example.com/logo.png"
              />
            </Field>
            {data.logoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img src={data.logoUrl} alt="logo preview" className="h-8 object-contain rounded border border-[#E2E8F0] p-1 bg-white" onError={(e) => (e.target.style.display = "none")} />
                <span className="text-[11.5px] text-[#64748B]">Logo preview</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Bill Details */}
      <Section title="🧾 Bill Details" defaultOpen={true}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Bill No." htmlFor="billNo">
            <input id="billNo" className={inputClass} value={data.billNo} onChange={set("billNo")} />
          </Field>
          <div className="col-span-2 md:col-span-1">
            <Field label="Date & Time" htmlFor="dateTime">
              <input id="dateTime" type="datetime-local" className={inputClass} value={data.dateTime} onChange={set("dateTime")} />
            </Field>
          </div>
          <Field label="Table / Dine In" htmlFor="dineIn">
            <input id="dineIn" className={inputClass} value={data.dineIn} onChange={set("dineIn")} placeholder="e.g. 5" />
          </Field>
          <Field label="Cashier" htmlFor="cashier">
            <input id="cashier" className={inputClass} value={data.cashier} onChange={set("cashier")} />
          </Field>
          <Field label="Customer Name" htmlFor="customerName">
            <input id="customerName" className={inputClass} value={data.customerName} onChange={set("customerName")} placeholder="Optional" />
          </Field>
          <Field label="TXN No." htmlFor="txnNo">
            <input id="txnNo" className={inputClass} value={data.txnNo} onChange={set("txnNo")} placeholder="POS template" />
          </Field>
          <Field label="Invoice No." htmlFor="invoiceNo">
            <input id="invoiceNo" className={inputClass} value={data.invoiceNo} onChange={set("invoiceNo")} placeholder="POS template" />
          </Field>
          <Field label="Order No." htmlFor="orderNo">
            <input id="orderNo" className={inputClass} value={data.orderNo} onChange={set("orderNo")} placeholder="Thermal Full template" />
          </Field>
          <Field label="Waiter ID" htmlFor="waiterId">
            <input id="waiterId" className={inputClass} value={data.waiterId} onChange={set("waiterId")} placeholder="Thermal Full template" />
          </Field>
        </div>
      </Section>

      {/* Charges */}
      <Section title="💰 Charges" defaultOpen={true}>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Service Charge %" htmlFor="serviceChargePct">
            <input id="serviceChargePct" type="number" min="0" step="0.5" className={inputClass} value={data.serviceChargePct} onChange={setNum("serviceChargePct")} />
          </Field>
          <Field label="CGST %" htmlFor="cgstPct">
            <input id="cgstPct" type="number" min="0" step="0.5" className={inputClass} value={data.cgstPct} onChange={setNum("cgstPct")} />
          </Field>
          <Field label="SGST %" htmlFor="sgstPct">
            <input id="sgstPct" type="number" min="0" step="0.5" className={inputClass} value={data.sgstPct} onChange={setNum("sgstPct")} />
          </Field>
        </div>
        <p className={helperClass}>Service charge is discretionary in India and applied before GST, matching standard restaurant billing practice.</p>
      </Section>

      {/* Items */}
      <Section title="🍛 Items" defaultOpen={true}>
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_70px_90px_32px] gap-2 items-end">
              <Field label={i === 0 ? "Item Name" : ""} htmlFor={`item-name-${i}`}>
                <input id={`item-name-${i}`} className={inputClass} value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} />
              </Field>
              <Field label={i === 0 ? "Qty" : ""} htmlFor={`item-qty-${i}`}>
                <input id={`item-qty-${i}`} type="number" min="0" className={inputClass} value={item.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} />
              </Field>
              <Field label={i === 0 ? "Price (₹)" : ""} htmlFor={`item-price-${i}`}>
                <input id={`item-price-${i}`} type="number" min="0" step="0.01" className={inputClass} value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} />
              </Field>
              <button
                type="button"
                onClick={() => removeItem(i)}
                disabled={data.items.length <= 1}
                className="h-11 rounded-xl border border-[#FCA5A5] text-[#DC2626] disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="h-10 w-full rounded-xl border border-dashed border-[#CBD5E1] text-[#64748B] text-[13px] font-medium hover:bg-[#F8FAFC]"
          >
            + Add item
          </button>
        </div>
      </Section>
    </div>
  );
}

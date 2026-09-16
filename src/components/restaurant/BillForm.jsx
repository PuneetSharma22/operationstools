import PropTypes from "prop-types";
import Field from "../form/Field";
import Section from "../form/Section";
import { inputClass, inputClassFor, helperClass, warningBannerClass } from "../form/formStyles";
import { validateNumber, clampNumber } from "../form/validation";

// NOTE: same philosophy as the fuel bill's BillForm — every field here is
// read by at least one template (TXN/Invoice No -> POS, Order No/Waiter ID/
// FSSAI -> Thermal Full), so the form doesn't change shape when you switch
// templates. A field a given template doesn't show is a template-side
// choice, not something to hide here.
export default function BillForm({ data, onChange, onLogoChange }) {
  const set = (name) => (e) => onChange({ [name]: e.target.value });

  // Percentages are clamped on the way in (0–100) so a negative service
  // charge or a pasted "abc" can never reach computeTotals().
  const setPct = (name) => (e) => onChange({ [name]: clampNumber(e.target.value, { min: 0, max: 100 }) });

  const updateItem = (index, field, value) => {
    const items = data.items.map((it, i) => {
      if (i !== index) return it;
      if (field === "name") return { ...it, name: value };
      // Qty and price are money/count fields: clamp negatives to 0 and keep
      // "" for a cleared box rather than letting NaN into the item.
      return { ...it, [field]: clampNumber(value, { min: 0 }) };
    });
    onChange({ items });
  };

  const addItem = () => {
    onChange({ items: [...data.items, { name: "", qty: 1, price: 0 }] });
  };

  const removeItem = (index) => {
    onChange({ items: data.items.filter((_, i) => i !== index) });
  };

  const chargeErrors = {
    serviceChargePct: validateNumber(data.serviceChargePct, { label: "Service charge", min: 0, max: 100 }),
    cgstPct: validateNumber(data.cgstPct, { label: "CGST", min: 0, max: 100 }),
    sgstPct: validateNumber(data.sgstPct, { label: "SGST", min: 0, max: 100 }),
  };

  const itemErrors = (data.items || []).map((it) => ({
    qty: validateNumber(it.qty, { label: "Qty", min: 0 }),
    price: validateNumber(it.price, { label: "Price", min: 0 }),
  }));
  const hasItemError = itemErrors.some((e) => e.qty || e.price);

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
                <img src={data.logoUrl} alt="logo preview" className="h-8 object-contain rounded border border-border p-1 bg-white" onError={(e) => (e.target.style.display = "none")} />
                <span className="text-[11.5px] text-ink-muted">Logo preview</span>
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
          <Field label="Service Charge %" htmlFor="serviceChargePct" error={chargeErrors.serviceChargePct}>
            <input id="serviceChargePct" type="number" min="0" max="100" step="0.5" className={inputClassFor(chargeErrors.serviceChargePct)} value={data.serviceChargePct} onChange={setPct("serviceChargePct")} aria-invalid={Boolean(chargeErrors.serviceChargePct)} />
          </Field>
          <Field label="CGST %" htmlFor="cgstPct" error={chargeErrors.cgstPct}>
            <input id="cgstPct" type="number" min="0" max="100" step="0.5" className={inputClassFor(chargeErrors.cgstPct)} value={data.cgstPct} onChange={setPct("cgstPct")} aria-invalid={Boolean(chargeErrors.cgstPct)} />
          </Field>
          <Field label="SGST %" htmlFor="sgstPct" error={chargeErrors.sgstPct}>
            <input id="sgstPct" type="number" min="0" max="100" step="0.5" className={inputClassFor(chargeErrors.sgstPct)} value={data.sgstPct} onChange={setPct("sgstPct")} aria-invalid={Boolean(chargeErrors.sgstPct)} />
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
                <input id={`item-qty-${i}`} type="number" min="0" className={inputClassFor(itemErrors[i]?.qty)} value={item.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} aria-invalid={Boolean(itemErrors[i]?.qty)} />
              </Field>
              <Field label={i === 0 ? "Price (₹)" : ""} htmlFor={`item-price-${i}`}>
                <input id={`item-price-${i}`} type="number" min="0" step="0.01" className={inputClassFor(itemErrors[i]?.price)} value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} aria-invalid={Boolean(itemErrors[i]?.price)} />
              </Field>
              <button
                type="button"
                onClick={() => removeItem(i)}
                disabled={data.items.length <= 1}
                className="h-11 rounded-xl border border-danger-border text-danger disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="h-10 w-full rounded-xl border border-dashed border-border-soft text-ink-muted text-[13px] font-medium hover:bg-surface"
          >
            + Add item
          </button>
        </div>

        {/* The per-row error text is suppressed (the 70px/90px columns are far
            too narrow for a message); one banner under the list carries it
            instead, so the invalid row is still flagged by its red border. */}
        {hasItemError && (
          <p className={warningBannerClass} role="status">
            ⚠ Quantity and price must be non-negative numbers. Rows that are
            not are counted as 0 in the bill total.
          </p>
        )}
      </Section>
    </div>
  );
}

const itemShape = PropTypes.shape({
  name: PropTypes.string,
  qty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

BillForm.propTypes = {
  /** The full restaurant-bill record owned by RestaurantBillPage. */
  data: PropTypes.shape({
    restaurantName: PropTypes.string,
    address: PropTypes.string,
    establishedYear: PropTypes.string,
    gstin: PropTypes.string,
    fssaiNo: PropTypes.string,
    logoUrl: PropTypes.string,
    billNo: PropTypes.string,
    dateTime: PropTypes.string,
    dineIn: PropTypes.string,
    cashier: PropTypes.string,
    customerName: PropTypes.string,
    txnNo: PropTypes.string,
    invoiceNo: PropTypes.string,
    orderNo: PropTypes.string,
    waiterId: PropTypes.string,
    serviceChargePct: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cgstPct: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sgstPct: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.arrayOf(itemShape).isRequired,
  }).isRequired,
  /** Receives a partial patch object, e.g. { billNo: "51" }. */
  onChange: PropTypes.func.isRequired,
  /** Optional dedicated handler for the logo URL; falls back to onChange. */
  onLogoChange: PropTypes.func,
};

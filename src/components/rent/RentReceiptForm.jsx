import PropTypes from "prop-types";
import Field from "../form/Field";
import Section from "../form/Section";
import { inputClass, inputClassFor, warningBannerClass } from "../form/formStyles";
import { validateNumber } from "../form/validation";

export default function RentReceiptForm({ data, onChange }) {
  // Rent is the only numeric field on this form and it drives both the
  // figures and the amount-in-words line, so a bad value has to be caught
  // before it reaches the template.
  const rentError = validateNumber(data.rentAmount, { label: "Rent amount", min: 0 });

  return (
    <div>
      <Section title="🧾 Receipt Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Receipt No." htmlFor="receiptNo">
            <input id="receiptNo" className={inputClass} name="receiptNo" value={data.receiptNo} onChange={onChange} placeholder="001" />
          </Field>
          <Field label="Receipt Date" htmlFor="receiptDate">
            <input id="receiptDate" className={inputClass} type="date" name="receiptDate" value={data.receiptDate} onChange={onChange} />
          </Field>
          <Field label="Period From" htmlFor="periodFrom">
            <input id="periodFrom" className={inputClass} type="month" name="periodFrom" value={data.periodFrom} onChange={onChange} />
          </Field>
          <Field label="Period To" htmlFor="periodTo">
            <input id="periodTo" className={inputClass} type="month" name="periodTo" value={data.periodTo} onChange={onChange} />
          </Field>
        </div>
      </Section>


      <Section title="💰 Rent Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Rent Amount (₹)" htmlFor="rentAmount" error={rentError}>
              <input
                id="rentAmount"
                className={inputClassFor(rentError)}
                type="number"
                min="0"
                step="0.01"
                name="rentAmount"
                value={data.rentAmount}
                onChange={onChange}
                placeholder="e.g. 15000"
                aria-invalid={Boolean(rentError)}
              />
            </Field>
          </div>
          <Field label="Payment Method" htmlFor="paymentMethod">
            <select id="paymentMethod" className={inputClass} name="paymentMethod" value={data.paymentMethod} onChange={onChange}>
              <option>Cash</option>
              <option>Cheque</option>
              <option>NEFT</option>
              <option>IMPS</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>
          </Field>
          <Field label="Reference / Cheque No. (optional)" htmlFor="paymentRef">
            <input id="paymentRef" className={inputClass} name="paymentRef" value={data.paymentRef} onChange={onChange} placeholder="UTR / Cheque No." />
          </Field>
        </div>
        {rentError && (
          <p className={warningBannerClass} role="status">
            ⚠ The receipt shows ₹0 (and no amount in words) until the rent
            amount is a valid, non-negative number.
          </p>
        )}
      </Section>

      <Section title="🏠 Property Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Property Address" htmlFor="propertyAddress">
              <input id="propertyAddress" className={inputClass} name="propertyAddress" value={data.propertyAddress} onChange={onChange} placeholder="Flat 4B, Sunrise Apartments, Andheri West, Mumbai - 400053" />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="👤 Tenant Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Tenant Name" htmlFor="tenantName">
              <input id="tenantName" className={inputClass} name="tenantName" value={data.tenantName} onChange={onChange} placeholder="e.g. Rajesh Verma" />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="🏦 Landlord Details" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Landlord Name" htmlFor="landlordName">
              <input id="landlordName" className={inputClass} name="landlordName" value={data.landlordName} onChange={onChange} placeholder="e.g. Ramesh Kumar" />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Landlord PAN" htmlFor="landlordPan">
              <input id="landlordPan" className={inputClass} name="landlordPan" value={data.landlordPan} onChange={onChange} placeholder="ABCDE1234F" style={{ textTransform: "uppercase" }} />
            </Field>
          </div>
        </div>
      </Section>
    </div>
  );
}

RentReceiptForm.propTypes = {
  /** The full rent-receipt record owned by RentReceiptPage. */
  data: PropTypes.shape({
    receiptNo: PropTypes.string,
    receiptDate: PropTypes.string,
    periodFrom: PropTypes.string,
    periodTo: PropTypes.string,
    rentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    paymentMethod: PropTypes.string,
    paymentRef: PropTypes.string,
    propertyAddress: PropTypes.string,
    tenantName: PropTypes.string,
    landlordName: PropTypes.string,
    landlordPan: PropTypes.string,
  }).isRequired,
  /** Native change handler — reads event.target.name / .value. */
  onChange: PropTypes.func.isRequired,
};

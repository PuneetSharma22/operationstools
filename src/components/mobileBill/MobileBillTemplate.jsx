// Preview / export template for the Mobile / Telephone Bill generator.
// Renders one of two genuinely different layouts depending on data.billType
// — postpaid reads as a GST tax invoice, prepaid reads as a payment receipt
// — themed by data.operator's brand colours.

import { OPERATORS } from "./operatorThemes";

const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";

function numberToWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  const convert = (num) => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? " "+ones[num%10] : "");
    if (num < 1000) return ones[Math.floor(num/100)] + " Hundred" + (num%100 ? " "+convert(num%100) : "");
    if (num < 100000) return convert(Math.floor(num/1000)) + " Thousand" + (num%1000 ? " "+convert(num%1000) : "");
    if (num < 10000000) return convert(Math.floor(num/100000)) + " Lakh" + (num%100000 ? " "+convert(num%100000) : "");
    return convert(Math.floor(num/10000000)) + " Crore" + (n%10000000 ? " "+convert(n%10000000) : "");
  };
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  return convert(rupees) + " Rupees" + (paise > 0 ? " and " + convert(paise) + " Paise" : "") + " Only";
}

function PostpaidInvoice({ data, theme }) {
  const rental = Number(data.planRental || 0);
  const lateFee = Number(data.lateFee || 0);
  const prevBalance = Number(data.previousBalance || 0);
  const taxableBase = rental + lateFee;
  const gstAmt = taxableBase * Number(data.gstRate || 0) / 100;
  const cgst = gstAmt / 2;
  const sgst = gstAmt / 2;
  const grandTotal = taxableBase + gstAmt + prevBalance;

  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 12, color: INK, padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: `3px solid ${theme.primary}` }}>
        <div>
          {data.logoUrl ? <img src={data.logoUrl} alt="logo" style={{ maxHeight: 48, maxWidth: 160, objectFit: "contain", marginBottom: 8, display: "block" }} />
            : <div style={{ fontSize: 24, fontWeight: 900, color: theme.primary, letterSpacing: "-0.02em" }}>{data.operatorName || theme.name}</div>}
          <div style={{ fontSize: 11, color: INK_MUTED, marginTop: 6 }}>FIXEDLINE, MOBILE & BROADBAND SERVICES</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: theme.primary, letterSpacing: "-0.02em", marginBottom: 8 }}>TAX INVOICE</div>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 16px", fontSize: 12 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}><span style={{ color: INK_MUTED }}>Invoice No.</span><strong>{data.invoiceNo || "—"}</strong></div>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}><span style={{ color: INK_MUTED }}>Invoice Date</span><strong>{data.invoiceDate ? new Date(data.invoiceDate + "T00:00:00").toLocaleDateString("en-IN") : "—"}</strong></div>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}><span style={{ color: INK_MUTED }}>Due Date</span><strong>{data.dueDate ? new Date(data.dueDate + "T00:00:00").toLocaleDateString("en-IN") : "—"}</strong></div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: INK_SOFT, marginBottom: 16 }}>Plan: <strong style={{ color: INK }}>{data.planName || "—"}</strong>{data.billingPeriod && <span> · Billing Period: <strong style={{ color: INK }}>{data.billingPeriod}</strong></span>}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: theme.accent, borderRadius: 8, padding: "12px 14px", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Billed By</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: INK }}>{data.operatorName || theme.name}</div>
          <div style={{ fontSize: 11, color: INK_SOFT, lineHeight: 1.7 }}>
            {data.gstin && <div>GSTIN: {data.gstin}</div>}
            {data.pan && <div>PAN: {data.pan}</div>}
          </div>
        </div>
        <div style={{ background: SURFACE, borderRadius: 8, padding: "12px 14px", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Billed To</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: INK }}>{data.customerName || "Customer Name"}</div>
          <div style={{ fontSize: 11, color: INK_SOFT, lineHeight: 1.7 }}>
            {data.customerAddress && <div>{data.customerAddress}</div>}
            {data.mobileNumber && <div>Phone: +91 {data.mobileNumber}</div>}
          </div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead><tr style={{ background: theme.primary, color: "#fff" }}>
          {["Item","GST Rate","Qty","Rate (₹)","Amount (₹)","CGST","SGST","Total (₹)"].map(h => <th key={h} style={{ padding: "8px 10px", fontSize: 10, fontWeight: 700, textAlign: h==="Item" ? "left" : "right" }}>{h}</th>)}
        </tr></thead>
        <tbody>
          <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
            <td style={{ padding: "9px 10px" }}>{data.planName || "Plan Rental"}</td>
            <td style={{ padding: "9px 10px", textAlign: "right" }}>{data.gstRate}%</td>
            <td style={{ padding: "9px 10px", textAlign: "right" }}>1</td>
            <td style={{ padding: "9px 10px", textAlign: "right" }}>{rental.toFixed(2)}</td>
            <td style={{ padding: "9px 10px", textAlign: "right" }}>{rental.toFixed(2)}</td>
            <td style={{ padding: "9px 10px", textAlign: "right" }}>{(rental * Number(data.gstRate||0) / 200).toFixed(2)}</td>
            <td style={{ padding: "9px 10px", textAlign: "right" }}>{(rental * Number(data.gstRate||0) / 200).toFixed(2)}</td>
            <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700 }}>{(rental * (1 + Number(data.gstRate||0)/100)).toFixed(2)}</td>
          </tr>
          {lateFee > 0 && (
            <tr style={{ borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
              <td style={{ padding: "9px 10px" }}>Late Payment Fee</td>
              <td style={{ padding: "9px 10px", textAlign: "right" }}>{data.gstRate}%</td>
              <td style={{ padding: "9px 10px", textAlign: "right" }}>1</td>
              <td style={{ padding: "9px 10px", textAlign: "right" }}>{lateFee.toFixed(2)}</td>
              <td style={{ padding: "9px 10px", textAlign: "right" }}>{lateFee.toFixed(2)}</td>
              <td style={{ padding: "9px 10px", textAlign: "right" }}>{(lateFee * Number(data.gstRate||0) / 200).toFixed(2)}</td>
              <td style={{ padding: "9px 10px", textAlign: "right" }}>{(lateFee * Number(data.gstRate||0) / 200).toFixed(2)}</td>
              <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700 }}>{(lateFee * (1 + Number(data.gstRate||0)/100)).toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ width: 260 }}>
          {[["Taxable Amount", taxableBase], [`CGST`, cgst], [`SGST`, sgst], prevBalance > 0 ? ["Previous Balance", prevBalance] : null].filter(Boolean).map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${SURFACE_ALT}`, fontSize: 12 }}><span style={{ color: INK_MUTED }}>{l}</span><span>₹{v.toFixed(2)}</span></div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: theme.primary, color: "#fff", borderRadius: 8, marginTop: 8, fontSize: 14, fontWeight: 800 }}><span>Total (INR)</span><span>₹{grandTotal.toFixed(2)}</span></div>
        </div>
      </div>

      <div style={{ background: SURFACE_ALT, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 11, color: INK_SOFT }}>
        <strong style={{ color: INK }}>Total (in words):</strong> {numberToWords(Math.round(grandTotal * 100) / 100)}
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, fontSize: 10, color: INK_MUTED }}>
        Payment Modes — Pay online using debit/credit card, netbanking, UPI, or via the {data.operatorName || theme.name} app. This is an electronically generated document, no signature is required.
      </div>
    </div>
  );
}

function PrepaidReceipt({ data, theme }) {
  const amount = Number(data.rechargeAmount || 0);
  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 12, color: INK, padding: "32px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        {data.logoUrl ? <img src={data.logoUrl} alt="logo" style={{ maxHeight: 44, objectFit: "contain", margin: "0 auto 12px", display: "block" }} />
          : <div style={{ fontSize: 22, fontWeight: 900, color: theme.primary, letterSpacing: "-0.02em" }}>{data.operatorName || theme.name}</div>}
        <div style={{ fontSize: 16, fontWeight: 800, color: INK, marginTop: 6 }}>Payment Receipt</div>
        <div style={{ fontSize: 11, color: INK_MUTED, marginTop: 4 }}>Thank you for choosing {data.operatorName || theme.name} service. Here is the payment receipt.</div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, border: `1px solid ${BORDER}` }}>
        <tbody>
          {[
            ["Receipt No.", data.receiptNo || "—"],
            ["Customer Name", data.customerName || "—"],
            ["Customer Number", data.mobileNumber ? `+91 ${data.mobileNumber}` : "—"],
            ["Order Number", data.orderNo || "—"],
            ["Line of Business", `${data.operatorName || theme.name} Prepaid`],
            ["Recharge Plan", data.rechargePlan || "—"],
            ["Validity", data.validity || "—"],
            ["Payment Date & Time", data.paymentDate ? new Date(data.paymentDate + "T00:00:00").toLocaleDateString("en-IN") : "—"],
            ["Payment Mode", data.paymentMode || "—"],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: `1px solid ${BORDER}` }}>
              <td style={{ padding: "10px 14px", color: INK_MUTED, width: "45%", background: SURFACE }}>{label}</td>
              <td style={{ padding: "10px 14px", fontWeight: 600, color: INK }}>{value}</td>
            </tr>
          ))}
          <tr>
            <td style={{ padding: "10px 14px", color: INK_MUTED, background: SURFACE, fontWeight: 700 }}>Paid Amount</td>
            <td style={{ padding: "10px 14px", fontWeight: 800, color: theme.primary, fontSize: 14 }}>INR {amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14, fontSize: 10.5, color: INK_MUTED, lineHeight: 1.7 }}>
        <strong style={{ color: INK }}>Terms and Conditions</strong>
        <ol style={{ margin: "6px 0 0", paddingLeft: 16 }}>
          <li>Payment posting to your account is subject to credit settlement by your bank and will be posted within the next 2 working days (maximum).</li>
          <li>The above amount is inclusive of applicable taxes.</li>
          <li>This is a system-generated receipt and does not require a signature.</li>
        </ol>
      </div>
    </div>
  );
}

export default function MobileBillTemplate({ data }) {
  const theme = OPERATORS[data.operator] || OPERATORS.other;
  return data.billType === "prepaid" ? <PrepaidReceipt data={data} theme={theme} /> : <PostpaidInvoice data={data} theme={theme} />;
}
